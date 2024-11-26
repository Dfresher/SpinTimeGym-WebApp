import { useState, useEffect } from "react";
import SideMenu from "./SideMenu";
import ClientTable from "./ClientTable";
import { Client } from "./types";

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

  const handlePayment = async (clientId: string, amount: number) => {
    try {
      const response = await fetch(`http://localhost:3001/clients/${clientId}/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
  
      if (response.ok) {
        const clientsResponse = await fetch("http://localhost:3001/clients");
        const updatedClients = await clientsResponse.json();
        setClients(updatedClients);
      } else {
        const errorData = await response.json();
        console.error('Payment failed:', errorData.error);
      }
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };
  

  const handleCheckIn = (clientId: string) => {
    fetch("http://localhost:3001/attendance/checkin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId }),
    }).then(() => {
      fetch("http://localhost:3001/clients")
        .then((response) => response.json())
        .then((data) => setClients(data));
    });
  };

  const handleCheckOut = (clientId: string) => {
    fetch("http://localhost:3001/attendance/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId }),
    }).then(() => {
      fetch("http://localhost:3001/clients")
        .then((response) => response.json())
        .then((data) => setClients(data));
    });
  };

  return (
    <>
      <SideMenu addClient={addClient} />
      <div className="dashboard-container">
        <ClientTable 
          clients={clients} 
          deleteClient={deleteClient} 
          handlePayment={handlePayment}
          handleCheckIn={handleCheckIn}
          handleCheckOut={handleCheckOut}
        />
      </div>
    </>
  );
};

export default Dashboard;
