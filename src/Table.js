import React from "react";
import { useTable, useFilters } from "react-table";
import { useState } from 'react';
import "./Table.css"

function Table({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setFilter
  } = useTable(
    {
      columns,
      data
    },
    useFilters
  );

  const [valueInput, setValueInput] = useState("");

  const handleValueChange = e => {
    const value = e.target.value || undefined;
    setFilter("name", value);
    setValueInput(value);
  };

  return (
    <table {...getTableProps()}>
        <input value={valueInput} onChange={handleValueChange} placeholder={"Busca pelo nome"} />
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
export default Table;