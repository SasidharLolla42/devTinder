const express = require("express");
const app = express();

app.use("/test", (req, res) => {
  res.send("Welcome to test");
});

app.listen(3000, (req, res) => {
  console.log("Server is listening at port 3000");
});
