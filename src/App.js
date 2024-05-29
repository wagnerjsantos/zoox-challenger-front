import './App.css';
import { useEffect, useMemo, useState } from 'react';
import Axios from "axios";
import Table from './Table';

function App() {
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    Axios.get("http://localhost:8000/csv")
      .then((res) => {
        setData(res.data);
      })
  }, []);

  const handleDelete = (id) => {
    Axios.delete(`http://localhost:8000/csv/${id}`)
      .then(() => {
        setData(data.filter(item => item.id !== id));
      })
      .catch((error) => {
        console.error('Error deleting item', error);
      });
  };

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
          },
          {
            Header: "Ação",
            Cell: ({ row }) => (
              <button onClick={() => handleDelete(row.original.id)}>Deletar</button>
            )
          }
        ]
      }
    ],
    [data]
  );

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileUpload = () => {
    const formData = new FormData();
    formData.append('file', file);

    Axios.post("http://localhost:8000/csv", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then((response) => {
      console.log('File uploaded successfully', response.data);
      Axios.get("http://localhost:8000/csv")
        .then((res) => {
          setData(res.data);
        })
    })
    .catch((error) => {
      console.error('Error uploading file', error);
    });
  };

  return (
    <div className="App">
      <Table columns={columns} data={data} />
      <div className="upload-section">
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleFileUpload}>Upload CSV</button>
      </div>
    </div>
  );
}

export default App;