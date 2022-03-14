const axios = require("axios").default;
const CryptoJS = require("crypto-js");
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const path = require("path");
let randomWords = require("random-words");

const app = express();
app.use(express.static("./src"));
app.use(cors());

app.get("/", (req, res) => {
  res.render(path.join(__dirname, "./", "src/index.html"));
});

app.get("/word", (req, res) => {
//   let words = randomWords({ exactly: 10, wordsPerString: 1, min: 5, maxLength: 5, formatter: (word) => word.toUpperCase() }).filter((word) => word.length === 5);
//   res.json(words);
 let words = randomWords({
    exactly: 10,
    wordsPerString: 1,
    min: 5,
    maxLength: 5,
    formatter: (word) => word.toUpperCase(),
  }).filter((word) => word.length === 5);
  const myPassword = process.env.SALT_KEY;
  let encrypted = CryptoJS.AES.encrypt(JSON.stringify(words), myPassword).toString();
  res.json({ dados: encrypted });
});

const PORT = process.env.PORT || 3500;

app.listen(PORT, () => console.log("server working " + PORT));
