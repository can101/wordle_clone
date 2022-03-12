const axios = require("axios").default;
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const path = require("path");
let randomWords = require("random-words");
// let _ = require("lodash");

const app = express();
app.use(express.static("./src"));
app.use(cors());

app.get("/", (req, res) => {
  // res.render(path.join(__dirname, "./", "src/index.html"));
  console.log(path.join(__dirname, "./", "src/index.html"));
});

app.get("/word", (req, res) => {
  let words = randomWords({ exactly: 10, wordsPerString: 1, min: 5, maxLength: 5, formatter: (word) => word.toUpperCase() }).filter((word) => word.length === 5);
  res.json(words);
});

const PORT = process.env.PORT || 3500;

app.listen(PORT, () => console.log("server working " + PORT));
