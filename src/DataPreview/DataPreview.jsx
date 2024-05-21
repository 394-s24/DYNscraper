import React from "react";
import Table from "react-bootstrap/Table";
import "./DataPreview.css";

const DataPreview = ({ previewData }) => {

  const tableHead = previewData[0].map((item, index) => {
    return <th key={index}>{item}</th>;
  });

  let tableData = [];

  for (const [i, data] of previewData.slice(1).entries()) {
    let tableRow = data.map((item, index) => {
      return <td key={i + index}>{item}</td>;
    });

    tableData.push(<tr>{tableRow}</tr>);
  }

  return (
    <div className="scrollable-table-container">
      <Table striped bordered hover className="scrollable-table">
        <thead>
          <tr>{tableHead}</tr>
        </thead>
        <tbody>
          {tableData}
        </tbody>
      </Table>
    </div>
  );
};

export default DataPreview;
