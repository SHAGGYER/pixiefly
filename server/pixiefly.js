require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const TokenMiddleware = require("./Middleware/Token");

mongoose.connect(
  process.env.MONGODB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => console.log("Connected to MongoDB")
);

const app = express();
app.use(bodyParser.json());
app.use(TokenMiddleware);

app.use(express.static(path.join(__dirname, "..", "client/build")));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", require("./Controllers/AuthController"));
app.use("/api/search", require("./Controllers/SearchController"));
app.use("/api/billing", require("./Controllers/BillingController"));
app.use("/api/webhooks", require("./Controllers/WebhooksController"));
app.use("/api/auction", require("./Controllers/AuctionController"));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client/build/index.html"));
});

const PORT = process.env.NODE_PORT;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
