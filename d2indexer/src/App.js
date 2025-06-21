// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [folderFiles, setFolderFiles] = useState([]);
  const [chardb, setChardb] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/items')
      .then((response) => response.json())
      .then((data) => setItems(data));

    // Fetch chardb.json from backend
    fetch('http://localhost:5000/api/chardb')
      .then((response) => response.json())
      .then((data) => setChardb(data));
  }, []);

  const handleFolderChange = (event) => {
    const files = Array.from(event.target.files);
    // Only keep .d2s files
    const d2sFiles = files.filter(file => file.name.toLowerCase().endsWith('.d2s'));
    setFolderFiles(d2sFiles);
    if (d2sFiles.length > 0) {
      sendFolderToBackend(d2sFiles);
    }
  };

  const sendFolderToBackend = async (files) => {
    const formData = new FormData();
    files.forEach((file) => {
      // Use webkitRelativePath to preserve folder structure
      formData.append('files', file, file.webkitRelativePath);
    });
    try {
      const response = await fetch('http://localhost:5000/api/upload-folder', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Failed to upload folder');
      }
      // Optionally handle response
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Diablo</h1>
        <label style={{ marginBottom: '1em', display: 'block' }}>
          <input
            type="file"
            webkitdirectory="true"
            directory="true"
            multiple
            style={{ display: 'none' }}
            onChange={handleFolderChange}
            id="folderInput"
          />
          <button onClick={() => document.getElementById('folderInput').click()}>
            Choose Folder
          </button>
        </label>
        {folderFiles.length > 0 && (
          <div style={{ marginBottom: '1em' }}>
            <strong>Selected files:</strong>
            <ul>
              {folderFiles.map((file, idx) => (
                <li key={idx}>{file.webkitRelativePath}</li>
              ))}
            </ul>
          </div>
        )}
        <ul>
          {items.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
        {/* Display chardb.json data if available */}
        {chardb && (
          <div style={{ marginTop: '2em', textAlign: 'left', background: '#222', padding: '1em', borderRadius: '8px' }}>
            <h2 style={{ color: '#fff' }}>Character Database</h2>
            <pre style={{ color: '#fff', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{JSON.stringify(chardb, null, 2)}</pre>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;