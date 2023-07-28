import { Session } from "@/app/interfaces";
import LoginForm from "@/components/LoginForm/LoginForm";
import useApi from "@/hooks/useApi";
import useLogUser from "@/hooks/useLogUser";
import { Button } from "antd";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";

const Login = () => {
  const router = useRouter();
  const { postMethod } = useApi("/api/login");
  const { getMethod } = useApi("/api/users/me");
  const { onLoginSuccess } = useLogUser();
  const [error, setError] = useState<string>();

  const onLogin = useCallback(
    async (body: unknown) => {
      const result = await postMethod<Session>({
        body,
      } as { body: BodyInit });
      if (result?.data?.access_token) {
        const userResult = await getMethod<{
          user: { name: string; money: number };
        }>({
          ignoreAuth: true,
          headersParams: {
            authorization: `Bearer ${result?.data?.access_token}`,
          },
        });
        const session = {
          name: userResult?.data?.user.name,
          access_token: result?.data?.access_token,
          refresh_token: result?.data?.refresh_token,
        } as Session;
        onLoginSuccess(session);
        router.push({ pathname: "/video" });
      } else {
        setError((result?.data as any).message);
      }
    },
    [getMethod, onLoginSuccess, postMethod, router]
  );

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "50%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
      }}
    >
      <LoginForm
        onRegisterClick={() => router.push({ pathname: "/register" })}
        onLogin={onLogin}
        errors={[
          error && <p style={{ textAlign: "center", color: "red" }}>{error}</p>,
        ]}
      />
    </div>
  );
};

export default Login;
