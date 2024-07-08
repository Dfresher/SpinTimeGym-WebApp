import { useState, useEffect } from "react";
import { Menu, Modal, Form, Button, Input, DatePicker } from "antd";
import type { MenuProps, FormInstance } from "antd";
import { UserAddOutlined, HomeOutlined } from "@ant-design/icons";

type MenuItem = Required<MenuProps>["items"][number];

// Form field type
interface FieldType {
  name?: string;
  joinDate?: string;
}

// SubmitButton component
interface SubmitButtonProps {
  form: FormInstance;
}

interface SideMenuProps {
  addClient: (client: { id: string; name: string; joinDate: string }) => void;
}

const SubmitButton: React.FC<React.PropsWithChildren<SubmitButtonProps>> = ({
  form,
  children,
}) => {
  const [submittable, setSubmittable] = useState<boolean>(false);

  // Watch all form values
  const values = Form.useWatch([], form);

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setSubmittable(true))
      .catch(() => setSubmittable(false));
  }, [form, values]);

  return (
    <Button type="primary" htmlType="submit" disabled={!submittable}>
      {children}
    </Button>
  );
};

// Menu items
const items: MenuItem[] = [
  {
    key: "0",
    label: "SpinTime Gym",
    disabled: true,
  },
  {
    key: "1",
    label: "Inicio",
    icon: <HomeOutlined />,
  },
  {
    key: "2",
    label: "Añadir miembro",
    icon: <UserAddOutlined />,
  },
];

// SideMenu component
const SideMenu: React.FC<SideMenuProps> = ({ addClient }) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const handleOk = (values: FieldType) => {
    const newClient = {
      id: Date.now().toString(),
      name: values.name!,
      joinDate: values.joinDate!.toString(),
    };
    addClient(newClient);
    setOpen(false);
    form.resetFields();
  };

  const handleCancel = () => {
    setOpen(false);
    form.resetFields();
  };

  const onClick: MenuProps["onClick"] = (e) => {
    if (e.key === "2") {
      setOpen(true);
    }
  };

  return (
    <>
      <Menu
        onClick={onClick}
        style={{ width: 256 }}
        defaultSelectedKeys={["1"]}
        mode="inline"
        items={items}
        theme="dark"
      />

      <Modal
        title="Añadir miembro"
        open={open}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          name="addUserForm"
          layout="vertical"
          style={{ maxWidth: 500, margin: 15 }}
          onFinish={handleOk}
          autoComplete="off"
          requiredMark={false}
        >
          <Form.Item<FieldType>
            label="Nombre:"
            name="name"
            validateDebounce={1000}
            rules={[{ required: true, message: "Nombre requerido!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label="Inscripcion:"
            name="joinDate"
            validateDebounce={1000}
            rules={[{ required: true, message: "Fecha requerida!" }]}
          >
            <DatePicker />
          </Form.Item>
          <div className="modal-button-container">
            <Button key="cancel" htmlType="reset" onClick={handleCancel}>
              Cancelar
            </Button>
            <SubmitButton form={form}>OK</SubmitButton>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default SideMenu;
