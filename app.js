require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const routes = require("./routes");
const cors = require("cors");

app.use(express.json());
app.set("view engine", "ejs");
app.use(morgan("dev"));
app.use(cors);

app.use(routes);

app.use((req, res, next) => {
  return res.json({
    status: false,
    message: "are you lost?",
    data: null,
  });
});

app.use((err, req, res, next) => {
  console.log(err);
  return res.json({
    status: false,
    message: err.message,
    data: null,
  });
});

const { PORT } = process.env;

app.listen(PORT, () =>
  console.log(`running on port ${PORT} || http://localhost:${PORT}`)
);
