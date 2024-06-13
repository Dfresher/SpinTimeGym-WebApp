import { useState, useEffect } from "react";
import {
  UserAddOutlined,
  HomeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import type { MenuProps, FormInstance } from "antd";
import { Menu, Modal, Form, Button, Input, DatePicker } from "antd";

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
  {
    key: "3",
    label: "Buscar miembro",
    icon: <SearchOutlined />,
  },
];

// SideMenu component
const SideMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [data, setData] = useState<FieldType[]>([]);

  // Read data from local storage on component mount
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("formData") || "[]");
    setData(storedData);
  }, []);

  const handleOk = (values: FieldType) => {
    setOpen(false);
    const newData = [...data, values];
    setData(newData);
    localStorage.setItem("formData", JSON.stringify(newData));
    form.resetFields();
  };

  const handleCancel = () => {
    setOpen(false);
    form.resetFields();
  };

  const onClick: MenuProps["onClick"] = (e) => {
    if (e.key === "2") {
      setOpen(true);
    } else if (e.key === "3") {
      console.log("findUser pressed");
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
