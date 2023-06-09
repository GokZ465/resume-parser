// Import styles from App.css
import './App.css';
// Import the useState hook from the React library
// This allows us to create state within functional components
import React, { useState } from "react";
// Import the storage object from the firebase library
import { storage } from "./firebase";
// Import the ref and uploadBytes functions from the storage module
import { ref, uploadBytes } from "firebase/storage";
// Import the v4 function from the uuid library
// This allows us to generate unique IDs for stored files (Pedro Video)
import { v4 } from "uuid";
// Import Bootstrap styles
import 'bootstrap/dist/css/bootstrap.min.css';

function parsePDF(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const buffer = reader.result;
      const decoder = new TextDecoder("utf-8");
      const text = decoder.decode(buffer);
      resolve(text);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

function App() {
  // Use the useState hook to create a state variable called fileUpload, initially set to null
  const [fileUpload, setFileUpload] = useState(null);
  // Define a function called uploadFile
const uploadFile = async () => {
  if (!fileUpload) return;

  const fileRef = ref(storage, `files/${v4()}.pdf`);
  const textRef = ref(storage, `files/${v4()}.txt`);

  const text = await parsePDF(fileUpload);

  await Promise.all([
    uploadBytes(fileRef, fileUpload),
    uploadBytes(textRef, new Blob([text], { type: "text/plain" })),
  ]);

  setFileUpload(null);
  //done

  alert("File uploaded successfully!");
};
  
  // Render an input element that allows users to select a file to upload
  // Add an event listener on the input element that sets the fileUpload state to the selected file
  // Render a button that triggers the uploadFile function when clicked, only if a file has been selected
  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title mb-4">Upload your resume</h3>
              <div className="form-group">
                <input 
                  type="file" 
                  accept=".pdf"
                  className="form-control-file" 
                  onChange={
                    (event) => {
                      setFileUpload(event.target.files[0]);
                    }
                  }/>
              </div>
              <button 
                className="btn btn-primary"
                onClick={uploadFile}
                disabled={!fileUpload}>
                  Upload File
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;