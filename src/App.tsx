import SideMenu from "./components/SideMenu";
import ClientTable from "./components/ClientTable";
import "./App.css";

function App() {
  return (
    <>
      <SideMenu />
      <div className="table-container">
        <h3>Miembros del gimnasio:</h3>
        <ClientTable />
      </div>
    </>
  );
}

export default App;
