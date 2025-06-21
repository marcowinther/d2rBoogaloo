const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

// testing Java integration
const java = require("java");
const path = require('path');
const { format } = require('util');
const { json } = require('stream/consumers');
const fs = require('fs');

// const jarPath = path.join(__dirname,'d2rsavegameparser-1.5.2.jar');
const jarPath = path.join(__dirname,'d2rsavegameparser-1.5.2-experimental.jar');

java.classpath.push(jarPath);
// java.classpath.push(path.join(__dirname, 'src', 'MyClass.jar'));
console.log('Classpath:');

console.log(java.classpath);

var isExpac = false;

// const MyClass = java.import("MyClass");
// const MyParser = java.import('io.github.paladijn.d2rsavegameparser.parser.CharacterParser$1');
var ByteBuffer = java.import('java.nio.ByteBuffer');
// const Optional = java.import('java.util.Optional');
const D2Character = java.import('io.github.paladijn.d2rsavegameparser.model.D2Character');

const D2CharacterLoader = java.import('io.github.paladijn.d2rsavegameparser.parser.D2CharacterLoader');

// const D2CharacterLoader = java.newInstanceSync('io.github.paladijn.d2rsavegameparser.parser.D2CharacterLoader');
const charPath = path.normalize("C:/temp/d2Savefiles/ArmorBigly.d2s");

console.log('Character path:', charPath);

var isExpac = D2CharacterLoader.isExpansionCharacterSync(charPath);
var JsonString = D2CharacterLoader.createCharacterJsonFromFileSync(charPath);


console.log('Is Expansion Character:', isExpac);
// const result = MyClass.addNumbersSync(1, 2);
// console.log(result);
// end of Java integration testing

// ByteBuffer = D2CharacterLoader.loadFileToByteBuffer("C:/temp/d2Savefiles/ArmorBigly.d2s");

// var isExpac = false;  
  

console.log(isExpac);

app.use(cors());

const data = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: format('boolean: %s',isExpac) },
];

app.get('/api/items', (req, res) => {
  res.json(data);
});

//"C:/temp/d2Savefiles/ArmorBigly.d2s" armors bigly
app.get('/api/d2char', (req, res) => {
  // var isExpac = false;  
  // isExpac = D2CharacterLoader.isExpansionCharacter("C:/temp/d2Savefiles/ArmorBigly.d2s");
  res.json(isExpac);
});

// Endpoint to read and return chardb.json
app.get('/api/chardb', (req, res) => {
  const chardbPath = path.join(__dirname, 'chardb.json');
  fs.readFile(chardbPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading chardb.json:', err);
      return res.status(500).json({ error: 'Failed to read chardb.json' });
    }
    try {
      const jsonData = JSON.parse(data);
      res.json(jsonData);
    } catch (parseErr) {
      console.error('Error parsing chardb.json:', parseErr);
      res.status(500).json({ error: 'Invalid JSON format in chardb.json' });
    }
  });
});

// Overwrite chardb.json with the contents of JsonString
function overwriteChardbWithJsonString() {
  const chardbPath = path.join(__dirname, 'chardb.json');
  fs.writeFileSync(chardbPath, JsonString, 'utf8');
  console.log('chardb.json overwritten successfully.');
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});