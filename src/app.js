const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  // console.log(req.body);

  const user = new User(req.body);

  // const user = new User({
  //   firstName: "Sreekar",
  //   lastName: "Lolla",
  //   emailId: "lsreekar@gmail.com",
  //   password: "12345678",
  // });

  try {
    await user.save();
    res.send("user added successfully");
  } catch (err) {
    res.status(400).send("Error saving the user" + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(3000, () => {
      console.log("Server is listening at port 3000");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected");
  });
