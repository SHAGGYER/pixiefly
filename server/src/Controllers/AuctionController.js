const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { v4 } = require("uuid");
const Auction = require("../Models/Auction");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, v4() + "_" + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

const imagesUpload = upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "gallery", maxCount: 4 },
]);
router.post("/create", imagesUpload, async (req, res) => {
  const {
    title,
    description,
    minPrice,
    contactEmail,
    type,
    expiryDateTime,
  } = req.body;
  const auction = Auction({
    title,
    description,
    minPrice,
    contactEmail,
    type,
    expiryDateTime,
    avatar: "/uploads/" + req.files["avatar"][0].filename,
    gallery: req.files["gallery"].map((file) => "/uploads/" + file.filename),
    user: req.userId,
  });
  await auction.save();
  res.send({ auction });
});

router.get("/my-auctions", async (req, res) => {
  const auctions = await Auction.find({ user: req.userId });
  res.send({ auctions });
});

router.post("/edit/:id", async (req, res) => {
  await Auction.findByIdAndUpdate(req.params.id, { $set: req.body });
  const auction = await Auction.findById(req.params.id).populate("user");
  res.send({ auction });
});

router.get("/:id", async (req, res) => {
  const auction = await Auction.findById(req.params.id).populate("user");
  res.send({ auction });
});

module.exports = router;
