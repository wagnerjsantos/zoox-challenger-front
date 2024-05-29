import './App.css';
import { useEffect, useMemo, useState } from 'react';
import Axios from "axios"
import Table from './Table';

function App() {
  const [data, setData] = useState([])

  useEffect(() => {
    Axios.get("http://localhost:8000/csv")
      .then((res) => {
        setData(res.data)
      })
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: "Tabela de Usuários",
        columns: [
          {
            Header: "Nome",
            accessor: "name"
          },
          {
            Header: "Data de Nascimento",
            accessor: "birthday"
          },
          {
            Header: "Gênero",
            accessor: "gender"
          },
          {
            Header: "Nacionalidade",
            accessor: "nationality"
          },
          {
            Header: "Data de Criação",
            accessor: "created"
          },
          {
            Header: "Data de Atualização",
            accessor: "updated"
          }
        ]
      }
    ],
    []
  );

  return (
    <div className="App">
      <Table columns={columns} data={data} />
    </div>
  );
}
export default App;