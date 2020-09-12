const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.get("/init", async (req, res) => {
  let user = null;
  let installed = false;

  const adminUser = await User.findOne({ role: "root-admin" });
  if (adminUser) {
    installed = true;
  }

  if (req.userId) {
    user = await User.findById(req.userId);
  }

  res.send({ user, installed });
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({
    email: req.body.email.trim().toLowerCase(),
  });
  if (!user) {
    return res.status(401).send({
      message: "Kunne ikke logge dig ind",
    });
  }

  const passwordEquals = await bcrypt.compare(req.body.password, user.password);
  if (!passwordEquals) {
    return res.status(401).send({
      message: "Kunne ikke logge dig ind",
    });
  }

  const token = jwt.sign({ userId: user._id }, "abc123");
  res.send({ token });
});

router.post("/register", async (req, res) => {
  let messages = {};
  const emailExists = await User.findOne({
    email: req.body.email.trim().toLowerCase(),
  });
  if (emailExists) {
    messages.email = "Denne email er allerede registreret";
  }

  const displayNameExists = await User.findOne({
    displayName: req.body.email.trim(),
  });
  if (displayNameExists) {
    messages.displayName = "Dette Displaynavn er allerede registreret";
  }

  if (Object.keys(messages).length) {
    return res.status(401).send({ messages });
  }

  const user = User({
    ...req.body,
    email: req.body.email.trim().toLowerCase(),
    role: "user",
  });
  await user.save();

  const token = jwt.sign({ userId: user._id }, "abc123");
  res.send({ token });
});

router.post("/install", async (req, res) => {
  const adminExists = await User.findOne({ role: "root-admin" });
  if (adminExists) {
    return res.sendStatus(401);
  }

  const admin = User({
    ...req.body,
    email: req.body.email.toLowerCase(),
    role: "root-admin",
  });
  await admin.save();

  res.sendStatus(201);
});

module.exports = router;
