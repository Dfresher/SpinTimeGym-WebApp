import { useState, useEffect } from "react";
import SideMenu from "./SideMenu";
import ClientTable from "./ClientTable";

interface Client {
  id: string;
  name: string;
  joinDate: string;
}

const Dashboard: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    fetch("http://localhost:3001/clients")
      .then((response) => response.json())
      .then((data) => setClients(data));
  }, []);

  const addClient = (client: Client) => {
    fetch("http://localhost:3001/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(client),
    }).then(() => {
      setClients([...clients, client]);
    });
  };

  const deleteClient = (id: string) => {
    fetch(`http://localhost:3001/clients/${id}`, {
      method: "DELETE",
    }).then(() => {
      setClients(clients.filter((client) => client.id !== id));
    });
  };

  return (
    <>
      <SideMenu addClient={addClient} />
      <div className="table-container">
        <ClientTable clients={clients} deleteClient={deleteClient} />
      </div>
    </>
  );
};

export default Dashboard;
