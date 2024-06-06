import { useState } from "react";
import Navbar from "./components/Navbar";
import Table from "./components/Table";
import Modal from "./components/AddMemberModal";
import "./App.css";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddMemberClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Navbar onAddMemberClick={handleAddMemberClick} />
      <div className="main">
        <Table />
      </div>
      {isModalOpen && <Modal closeModal={closeModal} />}
    </>
  );
}

export default App;
