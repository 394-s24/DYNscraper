import { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./App.css";
import { YMCAscraper, urlSplitter } from "./WebScrapers.js";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
// sheetJS import
import { writeFile, utils, read, writeFileXLSX } from "xlsx";
import DataPreview from "./DataPreview/DataPreview.jsx";
import { header, categoriesMap } from "./ExtraneousData.js";

const App = () => {
  const [urlValue, setUrlValue] = useState("");
  const [resultFile, setResultFile] = useState(null);
  const [urlError, setUrlError] = useState("");
  const [preview, setPreview] = useState([[]]);
  const [isLoading, setLoading] = useState(false);
  var file;


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
    }
  }

  function download() {
    if (resultFile) {
      var wb = utils.book_new();
      utils.book_append_sheet(wb, resultFile, "Sheet1");
      writeFile(wb, "SheetJSExportAOA.csv");
    } else {
      console.log("error try again");
      console.log(file);
      console.log("file does not exist?");
    }
  }

  const getData = async (event) => {
    event.preventDefault();
    setLoading(true);
    setPreview([[]]);

    if (urlValue.includes("ymca")) {
      var sdata = await urlSplitter(urlValue);

      var fileData = Array();
      for (var key in sdata) {
        var item = sdata[key];
        var row = Array(32).fill("");
        row[1] = item["Title"];
        row[2] = item["Description"];
        row[4] = categoriesMap[item["Category"]]["dyn_category_number"];
        row[5] = item["Spots Remaining"].split("of")[1].trim();
        row[6] = item["Min_Age"];
        row[7] = item["Max_Age"];
        row[9] = item["Location"];
        row[10] = item["Address"];
        row[11] = item["City"];
        row[12] = item["State"];
        row[13] = item["Zipcode"];
        row[14] = item["program_url"];
        row[16] = item["Start_Date"];
        row[17] = item["End_Date"];
        row[18] = item["Start_Time"];
        row[19] = item["End_Time"];
        row[24] = item["Non_Member_Cost"];
        row[28] = item["internal_id"];
        row[29] = item["neighborhood"];
        row[30] = item["community"];
        row[31] = item["ward"];
        row[21] = item["Contact_Name"]
        row[23] = item["Contact_Phone"]
        fileData.push(row);
      }

      setPreview(fileData);
      fileData.unshift(header);
      var ws = utils.aoa_to_sheet(fileData, {
        bookType: "xlsx",
        type: "string",
      });
      setResultFile(ws);

      if (ws) {
        setLoading(false);
      }

      setUrlError("");
    } else {
      setUrlError(
        "This url type is not supported. Please enter a valid YMCA Program Search URL."
      );
      setLoading(false)
    }
  };

  let error = <br />;

  if (urlError != "") {
    error = <p style={{ color: "red" }}>{urlError}</p>;
  } else {
    error = <br />;
  }

  return (
    <Container>
      <Row style={{ textAlign: "center" }}>
        <Col>
          <h1>DYNscraper</h1>
        </Col>
      </Row>
      <Row style={{ textAlign: "center" }}>
        <form onSubmit={(e) => getData(e)}>
          <p>Enter YMCA Program Search URL</p>
          <input
            type="url"
            value={urlValue}
            onChange={(e) => setUrlValue(e.target.value)}
            required
          />
          {error}
          <Button
            variant="primary"
            disabled={isLoading}
            type="submit"
            style={{ margin: "5px" }}
          >
            {isLoading ? "Loading…" : "Get Data"}
          </Button>
          <br />
          {isLoading || resultFile == null ? null : (
            <Button id="download-button" onClick={download}>
              Download CSV
            </Button>
          )}
        </form>
      </Row>

      <Row>
        <Col className="scrollable-table-container">
          <DataPreview previewData={preview} />
        </Col>
      </Row>
    </Container>
  );
};

export default App;
