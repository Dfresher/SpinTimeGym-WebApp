import { useRef, useEffect, useState } from "react";
import { Table, Tag, Space, Button, Input, Modal, message } from "antd";
import type { TableColumnsType, TableProps, InputRef, TableColumnType } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import dayjs from "dayjs";
import { Client } from "./types";

type ClientIndex = keyof Client;

interface ClientTableProps {
  clients: Client[];
  deleteClient: (id: string) => void;
  handlePayment: (clientId: string, amount: number) => void;
  handleCheckIn: (clientId: string) => void;
  handleCheckOut: (clientId: string) => void;
}

// Table Component
const ClientTable: React.FC<ClientTableProps> = ({
  clients,
  deleteClient,
  handlePayment,
  handleCheckIn,
  handleCheckOut,
}) => {
  // Search code
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
          placeholder={`Search ${dataIndex}`}
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
      record[dataIndex] ? record[dataIndex]!.toString().toLowerCase().includes((value as string).toLowerCase()) : false
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
  const [amount, setAmount] = useState<number>(0);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  useEffect(() => {
    // Transform data on mount or whenever clients change
    const transformedData = clients.map((client) => {
      const paidDate = dayjs(client.lastPaymentDate).format("DD/MM/YY");
      const voidDate = dayjs(client.lastPaymentDate).add(1, "month").format("DD/MM/YY");
      const tags = dayjs().isAfter(dayjs(client.lastPaymentDate).add(1, "month"))
        ? ["Inactive"]
        : ["Active"];

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

  const handlePaymentClick = (clientId: string) => {
    setSelectedClientId(clientId);
    setAmount(0);

    let isAmountValid = false;

    const validateAmount = (amount: number) => {
        isAmountValid = amount >= 0 && amount <= 15;
    };

    const paymentModal = Modal.confirm({
        title: 'Make a Payment',
        content: (
            <div>
                <Input
                    type="number"
                    min={0}
                    max={15}
                    onChange={(e) => {
                        const value = Number(e.target.value);
                        setAmount(value);
                        validateAmount(value);
                        paymentModal.update({
                            okButtonProps: { disabled: !isAmountValid },
                        });
                    }}
                    placeholder="Enter payment amount"
                />
            </div>
        ),
        okButtonProps: { disabled: true },
        onOk: async () => {
            if (selectedClientId) {
                try {
                    await handlePayment(selectedClientId, amount);
                    message.success('Payment processed successfully');
                } catch (error) {
                    message.error('Payment failed. Please try again.');
                }
            }
        },
    });
};


  const handleCheckInClick = (clientId: string) => {
    handleCheckIn(clientId);
    message.success('Checked in successfully');
  };

  const handleCheckOutClick = (clientId: string) => {
    handleCheckOut(clientId);
    message.success('Checked out successfully');
  };

  // Actual Table
  const columns: TableColumnsType<Client> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 250,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Attendance",
      key: "attendance",
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => handleCheckInClick(record.id)}
            disabled={record.isCheckedIn}
          >
            Check-in
          </Button>
          <Button
            type="primary"
            onClick={() => handleCheckOutClick(record.id)}
            disabled={!record.isCheckedIn}
          >
            Check-out
          </Button>
        </Space>
      ),
    },
    {
      title: "Last Payment Date",
      dataIndex: "paidDate",
      key: "paidDate",
      width: 160,
    },
    {
      title: "Expiration",
      dataIndex: "voidDate",
      key: "voidDate",
      width: 150,
    },
    {
      title: "Status",
      dataIndex: "tags",
      key: "tags",
      width: 120,
      render: (tags: string[]) => (
        <>
          {tags.map((tag) => (
            <Tag color={tag === "Inactive" ? "volcano" : "green"} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => handlePaymentClick(record.id)}
          >
            Pay
          </Button>
          <Button danger onClick={() => deleteClient(record.id)}>
            Delete
          </Button>
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
