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

interface Client {
  id: string;
  name: string;
  joinDate: string;
}

type ClientIndex = keyof Client;

interface ClientTableProps {
  clients: Client[];
  deleteClient: (id: string) => void;
}

//Table Component
const ClientTable: React.FC<ClientTableProps> = ({ clients, deleteClient }) => {
  //Search code
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: ClientIndex
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
    dataIndex: ClientIndex
  ): TableColumnType<Client> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Escribe un nombre o fecha`}
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

  const [data, setData] = useState<Client[]>([]);

  useEffect(() => {
    // Transform data on mount or whenever clients change
    const transformedData = clients.map((client) => {
      const paidDate = dayjs(client.joinDate).format("D/MM/YY");
      const voidDate = dayjs(client.joinDate).add(1, "month").format("D/MM/YY");
      const tags = dayjs().isAfter(dayjs(client.joinDate).add(1, "month"))
        ? ["Inactivo"]
        : ["Activo"];

      return {
        ...client,
        key: client.id,
        paidDate,
        voidDate,
        tags,
      };
    });

    setData(transformedData);
  }, [clients]);

  //Actual Table
  const columns: TableColumnsType<Client> = [
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
      ...getColumnSearchProps("joinDate"),
    },
    {
      title: "Expiracion",
      dataIndex: "voidDate",
      key: "voidDate",
      width: 150,
    },
    {
      title: "Estado",
      dataIndex: "tags",
      key: "tags",
      width: 120,
      render: (tags: string[]) => (
        <>
          {tags.map((tag) => (
            <Tag color={tag === "Inactivo" ? "volcano" : "green"} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: "Accion",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => deleteClient(record.id)}>Eliminar</a>
        </Space>
      ),
    },
  ];

  const onChange: TableProps<Client>["onChange"] = (
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
