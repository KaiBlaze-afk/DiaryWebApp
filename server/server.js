require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usermodel = require("./models/users");
const UserEntries = require("./models/entries");
const app = express();
app.use(express.json());
app.use(cors());

app.post("/register", async (req, res) => {
  try {
    const user = await Usermodel.findOne({ email: req.body.email });
    if (!user) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      await Usermodel.create({
        email: req.body.email,
        password: hashedPassword,
        username: req.body.username,
      });
      res.json({ success: true });
    } else {
      res.json({ success: false, message: "User already exists" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Usermodel.findOne({ email });
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        const accessToken = generateAccessToken(user);
        res.json({ accessToken });
      } else {
        res.json({ success: false, message: "Incorrect password" });
      }
    } else {
      res.json({ success: false, message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.get("/dashboard", authenticateToken, async (req, res) => {
  try {
    const email = req.user.email;
    const userEntries = await UserEntries.find({ email });
    const user = await Usermodel.findOne({ email });
    const myUser = { username: user.username, email: user.email, viewMode: user.viewMode };
    res.json({ success: true, entries: userEntries, userInfo: myUser });
  } catch (error) {
    console.error("Error fetching entries:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.post("/Entry", authenticateToken, async (req, res) => {
  try {
    const { color, dateTime, tags, data } = req.body;
    const email = req.user.email;

    const formattedDate = dateTime; 

    let existingEntry = await UserEntries.findOne({
      email: email,
      dateTime: formattedDate,
    });

    if (existingEntry) {
      existingEntry.color = color;
      existingEntry.tags = tags;
      existingEntry.data = data;
      await existingEntry.save();

      res.status(200).json({ message: "Entry updated successfully", entry: existingEntry });
    } else {
      const newEntry = await UserEntries.create({
        color,
        email,
        dateTime: formattedDate,
        tags,
        data,
      });

      res.status(201).json({ message: "Entry created successfully", entry: newEntry });
    }
  } catch (error) {
    console.error("Error processing entry:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/entry/:id", authenticateToken, async (req, res) => {
  try {
    const entryId = req.params.id;
    const email = req.user.email;

    const entry = await UserEntries.findOneAndDelete({ _id: entryId, email });

    if (entry) {
      res.status(200).json({ message: "Entry deleted successfully" });
    } else {
      res.status(404).json({ message: "Entry not found" });
    }
  } catch (error) {
    console.error("Error deleting entry:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

function generateAccessToken(user) {
  const payload = {
    id: user._id,
    email: user.email,
  };
  const secret = process.env.ACCESS_TOKEN_SECRET;

  return jwt.sign(payload, secret);
}

function verifyAccessToken(token) {
  const secret = process.env.ACCESS_TOKEN_SECRET;

  try {
    const decoded = jwt.verify(token, secret);
    return { success: true, data: decoded };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }
  const result = verifyAccessToken(token);

  if (!result.success) {
    return res.status(403).json({ error: result.error });
  }
  req.user = result.data;
  next();
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(3001, () => {
      console.log("Server is online...");
    });
  })
  .catch((err) => console.error(err));
