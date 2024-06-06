import "../App.css";

const arrow = "→";

function Table() {
  return (
    <div className="hero-side">
      <h4 className="hero-h4">Miembros del Gimnasio:</h4>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Pago</th>
            <th>Expiracion</th>
            <th>Estado</th>
            <th>Más</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Donfernando</td>
            <td>04/04/24</td>
            <td>05/04/24</td>
            <td className="status active">Activo</td>
            <td>{arrow}</td>
          </tr>
          <tr>
            <td>Alejandro</td>
            <td>04/12/24</td>
            <td>05/12/24</td>
            <td className="status active">Activo</td>
            <td>{arrow}</td>
          </tr>
          <tr>
            <td>Diogo</td>
            <td>02/21/24</td>
            <td>03/21/24</td>
            <td className="status inactive">Inactivo</td>
            <td>{arrow}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Table;
