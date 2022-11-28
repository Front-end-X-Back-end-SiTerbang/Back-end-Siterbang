require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const xss = require("xss-clean");
const app = express();
const routes = require("./routes");
const cors = require("cors");

app.use(express.json());
app.set("view engine", "ejs");
app.use(morgan("dev"));
app.use(xss());
app.use(cors());

app.use(routes);

// Main
app.get("/", (req, res) => {
  return res.status(200).send("Welcome -- SiTerbang API");
});

// Handling error not found!
app.use((req, res, next) => {
  return res.status(404).json({
    status: false,
    message: "are you lost?",
    data: null,
  });
});

// Handling error internal server error!
app.use((err, req, res, next) => {
  console.log(err);
  return res.status(500).json({
    status: false,
    message: err.message,
    data: null,
  });
});

const { PORT } = process.env;

app.listen(PORT, () =>
  console.log(`running on port ${PORT} || http://localhost:${PORT}`)
);
