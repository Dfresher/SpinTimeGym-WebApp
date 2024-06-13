import { useRef, useEffect, useState } from "react";
import { Table, Tag, Space, Button, Input } from "antd";
import type {
  TableColumnsType,
  TableProps,
  InputRef,
  TableColumnType,
} from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import dayjs from "dayjs";

interface DataType {
  key: React.Key;
  name: string;
  paidDate: string;
  voidDate: string;
  tags: string[];
}

type DataIndex = keyof DataType;

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

  const handleDelete = (record: DataType) => {
    const newData = data.filter((item) => item.key !== record.key);
    setData(newData);
    localStorage.setItem("formData", JSON.stringify(newData));
  };

  //Search code
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<DataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Escribe un nombre, fecha o estado`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Buscar
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Borrar
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Cerrar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns: TableColumnsType<DataType> = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
      width: 250,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Pago",
      dataIndex: "paidDate",
      key: "paidDate",
      width: 160,
      ...getColumnSearchProps("paidDate"),
    },
    {
      title: "Expiracion",
      dataIndex: "voidDate",
      key: "voidDate",
      width: 150,
      ...getColumnSearchProps("voidDate"),
    },
    {
      title: "Estado",
      key: "tags",
      dataIndex: "tags",
      width: 120,

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
      ...getColumnSearchProps("tags"),
    },
    {
      title: "Accion",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space size="large">
          <a onClick={() => handleDelete(record)}>Eliminar</a>
        </Space>
      ),
    },
  ];

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
