import { useRouter } from "next/router";
import { useSessionProvider } from "@/providers/useSessionProvider";
import { Session } from "../app/interfaces";
import { useCallback, useMemo } from "react";

const useLogUser = () => {
  const { setSession } = useSessionProvider();
  const router = useRouter();

  const onLoginSuccess = useCallback(
    (session: Session) => {
      setSession({ ...session } as Session);
      // save token
      document.cookie = `token=${session.access_token};`;
      localStorage.setItem("token", session.refresh_token);
    },
    [setSession]
  );

  const onLogout = useCallback(() => {
    // Clear all cookies
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    // clear storage
    localStorage.removeItem("token");
    setSession({ name: "", access_token: "", refresh_token: "", id: "" });
    router.push("/login");
  }, [router, setSession]);

  return useMemo(
    () => ({
      onLoginSuccess,
      onLogout,
    }),
    [onLoginSuccess, onLogout]
  );
};

export default useLogUser;
