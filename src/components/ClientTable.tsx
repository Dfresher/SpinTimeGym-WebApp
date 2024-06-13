import { useEffect, useState } from "react";
import { Table, Tag, Space } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import dayjs from "dayjs";

interface DataType {
  key: React.Key;
  name: string;
  paidDate: string;
  voidDate: string;
  tags: string[];
}

const columns: TableColumnsType<DataType> = [
  {
    title: "Nombre",
    dataIndex: "name",
    key: "name",
    width: 250,
  },
  {
    title: "Pago",
    dataIndex: "paidDate",
    key: "paidDate",
    width: 150,
  },
  {
    title: "Expiracion",
    dataIndex: "voidDate",
    key: "voidDate",
    width: 150,
  },
  {
    title: "Estado",
    key: "tags",
    dataIndex: "tags",
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? "geekblue" : "green";
          if (tag === "Inactivo") {
            color = "volcano";
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: "Accion",
    key: "action",
    width: 150,
    render: () => (
      <Space size="large">
        <a>Realizar pago</a>
      </Space>
    ),
  },
];

const ClientTable: React.FC = () => {
  const [data, setData] = useState<DataType[]>([]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("formData") || "[]");
    const transformedData = storedData.map((item: any, index: number) => {
      const paidDate = dayjs(item.joinDate).format("MM/DD/YYYY");
      const voidDate = dayjs(item.joinDate)
        .add(1, "month")
        .format("MM/DD/YYYY");
      const tags = dayjs().isAfter(voidDate) ? ["Inactivo"] : ["Activo"];

      return {
        key: index,
        name: item.name,
        paidDate,
        voidDate,
        tags,
      };
    });

    setData(transformedData);
  }, []);

  const onChange: TableProps<DataType>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  return (
    <Table columns={columns} dataSource={data} onChange={onChange} bordered />
  );
};

export default ClientTable;
