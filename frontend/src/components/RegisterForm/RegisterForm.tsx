import React, { useCallback, useState } from "react";
import { Button, Form, Input, theme } from "antd";
import styles from "./RegisterForm.module.scss";
import { colors } from "../../theme/colors";

interface RegisterFormProps {
  onRegister: (value: unknown) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister }) => {
  const onFinish = useCallback(
    (values: any) => {
      onRegister({ ...values });
    },
    [onRegister]
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
      className={styles["register-wrp"]}
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

      <Form.Item
        label="Confirm Password"
        name="passwordConfirm"
        dependencies={["password"]}
        labelCol={{ span: 8 }}
        labelAlign={"left"}
        rules={[
          {
            required: true,
            message: "Please confirm your password!",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error("The two passwords that you entered do not match!")
              );
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Register
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegisterForm;
