const mongoose = require("mongoose");

const AuctionSchema = mongoose.Schema(
  {
    type: String,
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    avatar: String,
    gallery: Array,
    description: String,
    title: String,
    minPrice: Number,
    contactEmail: String,
    expiryDateTime: Date,
  },
  {
    timestamps: true,
  }
);

const Auction = mongoose.model("Auction", AuctionSchema);
module.exports = Auction;
