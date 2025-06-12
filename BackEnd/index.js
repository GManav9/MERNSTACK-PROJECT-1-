const express = require("express");
const port = 8888;

const app = express();
const cors = require("cors");
const db = require("./config/db");

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use("/", require("./route/route"));

app.listen(port, (err) => {
  err ? console.log(err) : console.log("Server Started on the port " + port);
});
