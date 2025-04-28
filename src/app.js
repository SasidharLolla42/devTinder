const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const app = express();
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    //validate the data
    validateSignUpData(req);

    //Encrypt the password
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    //creating a new instance of user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    // const user = new User({
    //   firstName: "Sreekar",
    //   lastName: "Lolla",
    //   emailId: "lsreekar@gmail.com",
    //   password: "12345678",
    // });

    await user.save();
    res.send("user added successfully");
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      //Create a JWT token

      const token = await user.getJWT();

      //Add the token to cookie and sent back the response to user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });

      res.send("Login Successful!!!");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  console.log("Sending a connection request");

  res.send(user.firstName + " sent the connection request");
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
