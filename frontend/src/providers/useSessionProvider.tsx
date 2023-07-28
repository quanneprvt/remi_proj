import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { SessionType, Session, SocketMessage } from "@/app/interfaces";
import useApi from "@/hooks/useApi";
import { useRouter } from "next/router";
import { io, Socket } from "socket.io-client";
import useLogUser from "@/hooks/useLogUser";
import type { NotificationPlacement } from "antd/es/notification/interface";
import { notification } from "antd";

interface Props {
  children: ReactNode;
}

const SessionContext = createContext<SessionType>({
  name: "",
  access_token: "",
  refresh_token: "",
  setSession: (args) => args && args,
  socket: undefined,
  fetchNewAccessToken: () => {},
  id: "",
  eventHandlers: [],
});

export const SessionProvider: React.FC<Props> = ({ children }) => {
  const [session, setSession] = useState<Session>({
    name: "",
    access_token: "",
    refresh_token: "",
    myVideos: [],
    id: "",
  });
  const { getMethod } = useApi("/api/users/me");
  const router = useRouter();
  const socket = useRef<Socket>();
  const { onLogout } = useLogUser();
  const eventHandlers = useRef<{ component: string; handler: () => void }[]>();

  const [api, contextHolder] = notification.useNotification();

  const openNotification = useCallback(() => {
    api.info({
      message: `Attention`,
      description: "There is a new video uploaded",
      placement: "top",
    });
  }, [api]);

  const fetchNewAccessToken = useCallback(async () => {
    const refreshToken = localStorage.getItem("token");
    try {
      const data = await fetch("/api/token", {
        method: "POST",
        body: JSON.stringify({ token: refreshToken }),
      });
      const result = await data.json();
      document.cookie = `token=${result.data.access_token};`;
    } catch {
      onLogout();
      return false;
    }
  }, [onLogout]);

  useEffect(() => {
    async function fetchUser() {
      const token = document.cookie.split(";")?.[0]?.split("=")?.[1];
      const refreshToken = localStorage.getItem("token") || "";
      if (token) {
        let result;
        result = await getMethod<{
          user: { name: string; id: string; message?: string };
        }>({ ignoreRefresh: true });
        if (result?.message === "Unauthorized") {
          await fetchNewAccessToken();
          result = await getMethod<{
            user: { name: string; id: string; message?: string };
          }>({ ignoreRefresh: true });
        }
        if (result && Boolean(result?.data?.user)) {
          const session = {
            id: result.data?.user.id,
            name: result.data?.user.name,
            access_token: token,
            refresh_token: refreshToken,
          } as Session;
          if (!socket.current) {
            // socket
            socket.current = io(`${process.env.NEXT_PUBLIC_SERVER_URL}`, {
              path: "/subscription/",
              auth: {
                token: session.access_token,
              },
            });
            socket.current.on("VIDEO_SHARED", (message) => {
              const data = JSON.parse(message) as SocketMessage;
              if (data.video) {
                openNotification();
                //handle new video
                eventHandlers.current?.forEach((eventHandler) => {
                  eventHandler.handler();
                });
              }
            });
          }
          setSession(session);
          if (router.pathname.includes("login")) router.push("/video");
        }
      }
    }
    if (!router.pathname.includes("register")) fetchUser();
  }, [fetchNewAccessToken, getMethod, openNotification, router]);

  useEffect(() => {
    async function unloadSocket() {
      if (socket.current) {
        await socket.current.off("VIDEO_SHARED");
        await socket.current.close();
        socket.current = undefined;
      }
    }

    return () => {
      unloadSocket();
    };
  }, [openNotification]);

  const value = useMemo(() => {
    return {
      ...session,
      setSession,
      fetchNewAccessToken,
      socket: socket.current,
      eventHandlers: eventHandlers.current,
    };
  }, [session, fetchNewAccessToken]);

  return (
    <SessionContext.Provider value={value}>
      {contextHolder}
      {children}
    </SessionContext.Provider>
  );
};

export const useSessionProvider = () => {
  const value = useContext(SessionContext);
  return useMemo(() => value, [value]);
};
