import './App.css';
import { useEffect, useMemo, useState } from 'react';
import Axios from "axios";
import Table from './Table';
import TableLogs from './TableLogs';

function App() {
  const [data, setData] = useState([]);
  const [dataLog, setDataLog] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    Axios.get("http://localhost:8000/csv")
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => {
        console.error('Error fetching data', error);
      });
  }, []);

  useEffect(() => {
    Axios.get("http://localhost:8000/csv/logs")
      .then((res) => {
        setDataLog(res.data);
      })
      .catch((error) => {
        console.error('Error fetching data', error);
      });
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

  const handleUpdate = (id, updatedData) => {

    Axios.put(`http://localhost:8000/csv/${id}`, updatedData)
      .then((response) => {
        window.location.reload();
        setData(data.map(item => item.id === id ? response.data : item));
      })
      .catch((error) => {
        console.error('Error updating item', error);
      });
  };

  const columns = useMemo(
    () => [
      {
        Header: "Tabela de Usuários",
        columns: [
          {
            Header: "Nome",
            accessor: "name",
            Cell: EditableCell
          },
          {
            Header: "Data de Nascimento",
            accessor: "birthday",
            Cell: EditableCell
          },
          {
            Header: "Gênero",
            accessor: "gender",
            Cell: EditableCell
          },
          {
            Header: "Nacionalidade",
            accessor: "nationality",
            Cell: EditableCell
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
              <>
                <button onClick={() => handleUpdate(row.original.id, row.original)}>Salvar</button>
                <button onClick={() => handleDelete(row.original.id)}>Deletar</button>
              </>
            )
          }
        ]
      }
    ],
    [data]
  );

  const columnsLog = useMemo(
    () => [
      {
        Header: "Tabela de Logs",
        columns: [
          {
            Header: "Referência",
            accessor: "reference"
          },
          {
            Header: "Descrição",
            accessor: "description"
          }
        ]
      }
    ],
    [dataLog]
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
      <Table columns={columns} data={data} setData={setData} />
      <div className="upload-section">
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleFileUpload}>Upload CSV</button>
      </div>
      <TableLogs columns={columnsLog} data={dataLog} setData={setDataLog} />
    </div>
  );
}

const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData
}) => {
  const [value, setValue] = useState(initialValue);

  const onChange = e => {
    setValue(e.target.value);
  };

  const onBlur = () => {
    updateMyData(index, id, value);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return <input value={value} onChange={onChange} onBlur={onBlur} />;
};

export default App;