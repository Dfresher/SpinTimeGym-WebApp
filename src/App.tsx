import { useState, useEffect } from "react";
import SideMenu from "./components/SideMenu";
import ClientTable from "./components/ClientTable";
import "./App.css";

interface Client {
  id: string;
  name: string;
  joinDate: string;
}

function App() {
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
        <h3>Miembros del gimnasio:</h3>
        <ClientTable clients={clients} deleteClient={deleteClient} />
      </div>
    </>
  );
}

export default App;
