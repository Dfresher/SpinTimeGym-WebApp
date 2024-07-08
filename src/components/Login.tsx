import { useEffect, useState } from "react";
import { Form, Input, Button } from "antd";
import type { FormProps } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

type FieldType = {
  username?: string;
  password?: string;
};

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const [clientReady, setClientReady] = useState<boolean>(false);

  useEffect(() => {
    setClientReady(true);
  }, []);

  const navigate = useNavigate();

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success auth:", values);
    const hardcodedUsername = "admin";
    const hardcodedPassword = "123";

    if (
      values.username === hardcodedUsername &&
      values.password === hardcodedPassword
    ) {
      navigate("/dashboard");
    } else {
      console.log("Wrong username or password");
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed auth:", errorInfo);
  };

  return (
    <>
      <div className="login-container">
        <img src="/logo.png" alt="logo" className="logo-img" />
        <Form
          form={form}
          name="basic"
          size="large"
          style={{
            maxWidth: 600,
            marginTop: "30px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            name="username"
            rules={[{ required: true, message: "Este campo es requerido." }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Usuario"
            />
          </Form.Item>

          <Form.Item<FieldType>
            name="password"
            rules={[{ required: true, message: "Este campo es requerido." }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Contraseña"
            />
          </Form.Item>

          <Form.Item shouldUpdate>
            {() => (
              <Button
                type="primary"
                htmlType="submit"
                disabled={
                  !clientReady ||
                  !form.isFieldsTouched(true) ||
                  !!form.getFieldsError().filter(({ errors }) => errors.length)
                    .length
                }
              >
                Iniciar sesión
              </Button>
            )}
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default Login;
