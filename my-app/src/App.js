import React, { useState, useEffect } from "react";
import { storage } from "./firebase";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import "bootstrap/dist/css/bootstrap.min.css";

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
        storeFile(fileUpload);
      })
      .catch((error) => {
        console.log("Upload Error:", error);
      });
  };

  const storeFile = (file) => {
    const fileRef = ref(storage, `files/${file.name}`);
    uploadBytes(fileRef, file)
      .then(() => {
        console.log("File stored");
        searchFiles(); // Trigger search after storing the file
      })
      .catch((error) => {
        console.log("File Upload Error:", error);
      });
  };

  const openFileURL = (url) => {
    window.open(url, "_blank");
  };

  const searchFiles = () => {
    setIsLoading(true);
    const filesRef = ref(storage, "files");
    listAll(filesRef)
      .then((res) => {
        const searchPromises = res.items.map((item) =>
          getDownloadURL(item).then((url) =>
            fetchProxyFileContent(url, item.name)
          )
        );
        Promise.all(searchPromises)
          .then((results) => {
            const filteredResults = results.filter((result) =>
              result.content.toLowerCase().includes(searchQuery.toLowerCase())
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

  const fetchProxyFileContent = (url, fileName) => {
    const proxyUrl = `http://localhost:3001/fetch-file?url=${encodeURIComponent(
      url
    )}`;
    return fetch(proxyUrl)
      .then((response) => response.text())
      .then((fileContent) => ({ name: fileName, content: fileContent, url }))
      .catch((error) => {
        console.log("Fetch Error:", error);
        return { name: fileName, content: null, url };
      });
  };

  return (
    <div className="container">
      <h1 className="text-center">Private Cloud Storage</h1>
      <div className="row justify-content-center mb-3">
        <div className="col-6">
          <div className="input-group">
            <input
              type="file"
              className="form-control"
              onChange={(event) => {
                setFileUpload(event.target.files[0]);
              }}
            />
            <button
              className="btn btn-primary"
              onClick={uploadFile}
              disabled={isLoading}
            >
              Upload File
            </button>
          </div>
        </div>
      </div>
      {/* <div className="row justify-content-center mb-3">
        <div className="col-6">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search Files"
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
              }}
            />
            {searchQuery.trim() === "" && (
              <button
                className="btn btn-secondary"
                onClick={searchFiles}
                disabled={isLoading}
              >
                Fetch All
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-6">
          {isLoading ? (
            <p className="text-center">Loading...</p>
          ) : (
            <ul className="list-group">
              {searchResults.length === 0 ? (
                <li className="list-group-item text-center">
                  No results found
                </li>
              ) : (
                searchResults.map((result) => (
                  <li
                    key={result.name}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <span>{result.name}</span>
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View
                    </a>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </div> */}
    </div>
  );
}

export default App;
