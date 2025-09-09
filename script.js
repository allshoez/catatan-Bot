const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files (index.html, manifest.json, icon folder)
app.use(express.static(__dirname));

const DATASET_PATH = 'dataset.json';

function loadDataset() {
  if (!fs.existsSync(DATASET_PATH)) fs.writeFileSync(DATASET_PATH, '{}');
  return JSON.parse(fs.readFileSync(DATASET_PATH));
}

function saveDataset(data) {
  fs.writeFileSync(DATASET_PATH, JSON.stringify(data, null, 2));
}

app.post('/ask', (req, res) => {
  const msg = req.body.message.trim().toLowerCase();
  let dataset = loadDataset();
  let reply = 'Maaf, data tidak ditemukan.';

  if (msg.includes(':')) {
    const [key, value] = msg.split(':');
    dataset[key.trim()] = value.trim();
    saveDataset(dataset);
    reply = `Simpan: ${key.trim()} â ${value.trim()}`;
  } else {
    for (const key in dataset) {
      if (msg.includes(key)) {
        reply = `${key} â ${dataset[key]}`;
        break;
      }
    }
  }

  res.json({ reply });
});

app.listen(3000, () => console.log('â Catbot Backend aktif di http://localhost:3000'));

