import React, { useCallback } from "react";
import { Button, Checkbox, Form, Input, theme } from "antd";
import styles from "./LoginForm.module.scss";
import { colors } from "../../theme/colors";

interface LoginFormProps {
  onRegisterClick: () => void;
  onLogin: (values: unknown) => void;
  errors: React.ReactNode[];
}

const LoginForm: React.FC<LoginFormProps> = ({
  onRegisterClick,
  onLogin,
  errors,
}) => {
  const onFinish = useCallback(
    (values: any) => {
      onLogin({ name: values.name, password: values.password });
    },
    [onLogin]
  );

  const onFinishFailed = useCallback((errorInfo: any) => {
    console.log("Failed:", errorInfo);
  }, []);

  return (
    <Form
      name="basic"
      initialValues={{ remember: true }}
      style={{
        border: `1px solid ${colors.default.border}`,
        borderRadius: theme.defaultSeed.borderRadius,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      className={styles["login-wrp"]}
    >
      <Form.Item
        label="Username"
        name="name"
        rules={[{ required: true, message: "Please input your username!" }]}
        labelCol={{ span: 8 }}
        labelAlign={"left"}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
        labelCol={{ span: 8 }}
        labelAlign={"left"}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Login
        </Button>
      </Form.Item>
      <Form.ErrorList errors={errors} />
      <Button type="link" onClick={onRegisterClick}>
        Or Register
      </Button>
    </Form>
  );
};

export default LoginForm;
