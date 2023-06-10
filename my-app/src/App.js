import React, { useState, useEffect } from "react";
import { storage } from "./firebase";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist/webpack";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [fileUpload, setFileUpload] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
    } else {
      searchFiles();
    }
  }, [searchQuery]);

  const uploadFile = () => {
    if (fileUpload == null) return;

    const fileRef = ref(storage, `files/${fileUpload.name + uuidv4()}`);
    uploadBytes(fileRef, fileUpload)
      .then(() => {
        alert("File Uploaded");
        parsePDF(fileUpload);
      })
      .catch((error) => {
        console.log("Upload Error:", error);
      });
  };

  const parsePDF = (file) => {
    const fileReader = new FileReader();
    fileReader.onload = function () {
      const typedArray = new Uint8Array(this.result);
      getDocument(typedArray)
        .promise.then(function (pdfDocument) {
          const totalPages = pdfDocument.numPages;

          const getPageText = (page) =>
            page.getTextContent().then(function (textContent) {
              const pageText = textContent.items
                .map((item) => item.str)
                .join(" ");
              return pageText;
            });

          const getPagePromises = Array.from({ length: totalPages }, (_, i) =>
            pdfDocument.getPage(i + 1).then(getPageText)
          );

          Promise.all(getPagePromises)
            .then((pageTexts) => {
              const parsedText = pageTexts.join("\n");
              storeParsedText(parsedText, file);
            })
            .catch((error) => {
              console.log("PDF Parsing Error:", error);
            });
        })
        .catch((error) => {
          console.log("PDF Loading Error:", error);
        });
    };
    fileReader.readAsArrayBuffer(file);
  };

  const storeParsedText = (parsedText, file) => {
    const textFileRef = ref(storage, `files/${file.name}.txt`);
    const textFileBlob = new Blob([parsedText], { type: "text/plain" });

    uploadBytes(textFileRef, textFileBlob)
      .then(() => {
        console.log("Parsed text stored as text file");
      })
      .catch((error) => {
        console.log("Text File Upload Error:", error);
      });
  };

  const searchFiles = () => {
    setIsLoading(true);
    const filesRef = ref(storage, "files");
    listAll(filesRef)
      .then((res) => {
        const searchPromises = res.items.map((item) =>
          getDownloadURL(item).then((url) => ({
            name: item.name,
            url: url,
          }))
        );
        Promise.all(searchPromises)
          .then((results) => {
            const filteredResults = results.filter((result) =>
              result.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setSearchResults(filteredResults);
            setIsLoading(false);
          })
          .catch((error) => {
            console.log("Search Error:", error);
            setIsLoading(false);
          });
      })
      .catch((error) => {
        console.log("Listing Files Error:", error);
        setIsLoading(false);
      });
  };

  return (
    <div className="App">
      <h1>Resume Storage</h1>
      <div className="upload-section">
        <input
          type="file"
          onChange={(event) => {
            setFileUpload(event.target.files[0]);
          }}
        />
        <button onClick={uploadFile}>Upload File</button>
      </div>
      <div className="search-section">
        <input
          type="text"
          placeholder="Search Resumes"
          value={searchQuery}
          onChange={(event) => {
            setSearchQuery(event.target.value);
          }}
        />
        {searchQuery.trim() === "" && (
          <button onClick={searchFiles}>Fetch All</button>
        )}
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul className="results-list">
          {searchResults.map((result) => (
            <li key={result.name}>
              <a href={result.url} target="_blank" rel="noopener noreferrer">
                {result.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
export default App;