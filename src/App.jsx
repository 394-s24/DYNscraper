import { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { YMCAscraper } from "./WebScrapers.js";

const App = () => {
  // based on https://javascript.plainenglish.io/javascript-create-file-c36f8bccb3be
  const data = "foo,bar,\nfi,fie,fo,fum";
  console.log("testing download");
  const file = new File([data], "new-note.csv", {
    type: "text/csv",
  });

  // proof of concept from Riesbeck for fetching data from a website
  async function test() {
    var data;
    const url =
      "https://www.ymcachicago.org/program-search/?locations=LV&locations=MT&locations=SS&programs=AQ-Aquatics&keywords=";
    const proxyUrl = "https://corsproxy.io/?" + encodeURIComponent(url); // fixing cors error using this
    const response = await fetch(proxyUrl);
    if (!response.ok) {
      alert(response.statusText);
    } else {
      const text = await response.text();
      const doc = new DOMParser().parseFromString(text, "text/html");
      const firstEventTitle = doc.querySelector(
        ".section-container .section-container .program-desc__title"
      ).innerText;
      console.log(firstEventTitle);
    }
  }

  function download() {
    const link = document.createElement("a");
    const url = URL.createObjectURL(file);

    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  YMCAscraper("https://www.ymcachicago.org/program-search/?locations=BU&locations=CF&locations=EL&locations=FO&locations=FR&locations=GL&locations=HL&locations=IB&locations=IP&locations=KH&locations=LV&locations=MT&locations=RA&locations=SA&locations=SS&locations=SN&locations=CH&keywords=");


  return (
    <div className="App">
      <h1>Test</h1>
      <button onClick={download}>Download File</button>
      <br />
    </div>
  );
};

export default App;
