let ugh = "->";

function Table() {
  return (
    <>
      <div className="hero-side">
        <h4 className="hero-h4">Miembros del Gimnasio:</h4>
        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th scope="col">Nombre</th>
              <th scope="col">Pago</th>
              <th scope="col">Expiracion</th>
              <th scope="col">Estado</th>
              <th scope="col">Mas</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Donfernando</th>
              <td>04/04/24</td>
              <td>05/04/24</td>
              <td>Activo</td>
              <td>{ugh}</td>
            </tr>
            <tr>
              <th scope="row">Alejandro</th>
              <td>04/12/24</td>
              <td>05/12/24</td>
              <td>Activo</td>
              <td>{ugh}</td>
            </tr>
            <tr>
              <th scope="row">Diogo</th>
              <td>02/21/24</td>
              <td>03/21/24</td>
              <td>Inactivo</td>
              <td>{ugh}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Table();
