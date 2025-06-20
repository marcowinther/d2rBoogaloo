const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

// Java bridge setup
const java = require('java');
const path = require('path');
const jarPath = path.join(__dirname, 'd2rsavegameparser-1.5.2.jar');
java.classpath.push(jarPath);

// Replace 'your.package.ClassName' with the actual class name containing parseFiles
const ParserClass = java.import('io.github.paladijn.d2rsavegameparser.parser');

app.use(cors());

app.get('/api/items', (req, res) => {
  // Call the parseFiles method (adjust arguments as needed)
  ParserClass.parseFilesAsync((err, result) => {
    if (err) {
      res.status(500).json({ error: err.toString() });
    } else {
      // result is a Java List, convert to JS array if needed
      java.newArray('java.lang.Object', result).toArray((err2, jsArray) => {
        if (err2) {
          res.status(500).json({ error: err2.toString() });
        } else {
          res.json(jsArray);
        }
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});