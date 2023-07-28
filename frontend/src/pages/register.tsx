import { User } from "@/app/interfaces";
import RegisterForm from "@/components/RegisterForm/RegisterForm";
import useApi from "@/hooks/useApi";
import { useRouter } from "next/router";
import { useCallback } from "react";

const Register = () => {
  const { postMethod } = useApi("/api/register");
  const router = useRouter();

  const onRegister = useCallback(
    async (values: unknown) => {
      const result = await postMethod<{ user: User }>({
        body: { ...(values as object) },
      } as { body: BodyInit });
      if (result?.data?.user._id) {
        router.push("/login");
      }
    },
    [postMethod, router]
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
      <RegisterForm onRegister={onRegister} />
    </div>
  );
};

export default Register;
