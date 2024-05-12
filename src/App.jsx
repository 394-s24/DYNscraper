import { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { YMCAscraper } from "./WebScrapers.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';

const App = () => {
  const [urlValue, setUrlValue] = useState("");
  const [scrapingData, setScrapingData] = useState([{}]);
  const [resultFile, setResultFile] = useState(null);

  var file;

  // based on https://javascript.plainenglish.io/javascript-create-file-c36f8bccb3be
  // const data = "foo,bar,\nfi,fie,fo,fum";
  //  console.log("testing download");
  // const file = new File([data], "new-note.csv", {
  //   type: "text/csv",
  // });

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
    if (resultFile) {
      console.log("file exists")
      const file = resultFile;
      const link = document.createElement("a");
      const url = URL.createObjectURL(file);

      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } else {
      console.log("error try again")
      console.log(file)
      console.log("file does not exist?")
    }
    
  }

  const getData = async (event) => {
    event.preventDefault();

    if (urlValue.includes("ymca")) {
      // hide button so we can't click in middle
      if (document.getElementById("download-button").style.display == "inline") {
        document.getElementById("download-button").style.display = "none";
      }

      // if (document.getElementById("downloadButton")) {
      //   document.getElementById("downloadButton").remove();
      // }
      var sdata = await YMCAscraper(urlValue)
      console.log(sdata)
      setScrapingData(sdata)

      var fileData = Array();
      const header = "Folder_Name,Program_Name,Program_Description,Logo_URL,Category,Program_Capacity,Min_Age,Max_Age,Meeting_Type,Location_Name,Address,City,State,Zipcode,Program_URL,Registration_URL,Start_Date,End_Date,Start_Time,End_Time,Registration_Deadline,Contact_Name,Contact_Email,Contact_Phone,Price,Extra_Data,online_address,dosage,internal_id,neighborhood,community,ward";
      // const header = ["Folder_Name","Program_Name","Program_Description","Logo_URL","Category","Program_Capacity","Min_Age","Max_Age","Meeting_Type","Location_Name","Address","City","State","Zipcode","Program_URL","Registration_URL","Start_Date","End_Date","Start_Time","End_Time","Registration_Deadline","Contact_Name","Contact_Email","Contact_Phone","Price","Extra_Data","online_address","dosage","internal_id","neighborhood","community","ward"];



      sdata.forEach((item) => {
        var row = Array(32).fill("");
        row[1] = "\"" + item["Title"].replaceAll(",", "\,") + "\"";
        row[2] = "\"" + item["Description"].replaceAll(",", "\,") + "\"";
        console.log(row[2])
        row[5] = item["Spots Remaining"].split("of")[1].trim();
        row[6] = item["Min_Age"];
        row[7] = item["Max_Age"];
        row[9] = item["Location"];
        row[16] = item["Start_Date"];
        row[17] = item["End_Date"];
        row[18] = item["Start_Time"];
        row[19] = item["End_Time"];
        row[24] = "Member cost " + item["Member_Cost"] + " Non-member cost " + item["Non_Member_Cost"];
        fileData.push(row.toString() + "\n");
        // fileData.push(row);
        
      })

      // fileData.unshift(header);
      // fileData = fileData.join("\n")
      // console.log(fileData)
      fileData = header + "\n" + fileData.join("");

      file = new File([fileData], "dynscraper_data.csv", {
        type: "text/csv",
      });

      setResultFile(file);

      if (file) {
        // const button = document.createElement("Button");
        // button.innerHTML = "Download CSV";
        // button.onclick = download;
        // button.id = "downloadButton";
        // // find the div with class of 'app'
        // const app = document.querySelector(".App");
        // app.appendChild(button);
        document.getElementById("download-button").style.display = "inline";
        console.log("file created")
        
      }

      
    }
  }

  return (
    <div className="App">
      <h1>DYNscraper</h1>
      <br />
      <form onSubmit={(e) => getData(e)}>
        <p>Enter YMCA Program Search URL</p>
        <input type="url" value = {urlValue}  onChange = {(e) => setUrlValue(e.target.value)} required/>
        <br />
        <Button type="submit" style={{margin: '5px' }}>Get Data</Button>
        <br />
        <Button id="download-button" onClick={download} style={{ display: 'none', margin: '5px' }}>Download CSV</Button>
      </form>
    </div>
  );
};

export default App;
