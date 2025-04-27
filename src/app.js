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

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const users = await User.find({ emailId: userEmail });
    if (users.length === 0) {
      res.status(404).send("user not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const user = await User.find({});
    if (!user) {
      res.status(400).send("something went wrong");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("something went wrong");
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
