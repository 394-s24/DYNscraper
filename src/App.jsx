import { useState } from 'react';
import logo from './logo.svg';
import './App.css';

const App = () => {
  const [count, setCount] = useState(0);

  // based on https://javascript.plainenglish.io/javascript-create-file-c36f8bccb3be
  const data = "foo,bar,\nfi,fie,fo,fum";
  console.log("testing download");
  const file = new File([data], 'new-note.csv', {
    type: 'text/csv',
  })
  
  function download() {
    const link = document.createElement('a')
    const url = URL.createObjectURL(file)
  
    link.href = url
    link.download = file.name
    document.body.appendChild(link)
    link.click()
  
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  // based on proof of concept from Riesbeck for fetching data from a website
  async function fetchData() {
    var data = Array();
    const url = 'https://www.ymcachicago.org/program-search/?locations=LV&locations=MT&locations=SS&programs=AQ-Aquatics&keywords=';
    const proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(url); // fixing cors error using this
    const response = await fetch(proxyUrl);
    if (!response.ok) {
      alert(response.statusText);
    } else {
      const text = await response.text();
      const doc = new DOMParser().parseFromString(text, 'text/html');
      const firstRow = doc.querySelector('.section-container .section-container .table-responsive .program-table thead tr').children;
      // iterate over each item in the first row and print
      // we need to probably store this into an array to use as a lookup table for the
      // essential fields we need to put into the csv
      for (let i = 0; i < firstRow.length; i++) {
        console.log(firstRow[i].innerText.trim());
        data.push(firstRow[i].innerText.trim());
      }
    }
    console.log(data)
  }


  return (
    <div className="App">
      <h1>Test</h1>
      <button onClick={download}>Download File</button>
      <br />
      <button onClick={fetchData}>Fetch data</button>
    </div>
  );
};

export default App;
