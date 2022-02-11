const express = require("express");
const router = express.Router();
const RecentSearchResult = require("../Models/RecentSearchResult");
const moment = require("moment");
const mongoose = require("mongoose");

router.post("/create", async (req, res) => {
  const exists = await RecentSearchResult.findOne({
    $or: [
      {
        "item._id": req.body.item._id,
      },
      {
        "item._id": mongoose.Types.ObjectId(req.body.item._id),
      },
    ],
  });

  if (!exists) {
    const result = RecentSearchResult({ ...req.body, userId: req.userId });
    await result.save();
  } else {
    exists.updatedAt = Date.now();
    await exists.save();
  }

  await RecentSearchResult.deleteMany({
    createdAt: { $lte: moment().subtract(3, "days") },
  });

  res.sendStatus(201);
});

module.exports = router;
