import {ICard} from "./Interfaces/ICard";
import {IGameData} from "./Interfaces/IGameData";

require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const TokenMiddleware = require("./Middleware/Token");
const { v4 } = require("uuid");

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
const server = app.listen(PORT, () =>
  console.log(`Server started on port ${PORT}`)
);
const io = require("socket.io")(server);
const QUEUE = {};
const CARDS = [];
io.sockets.on("connection", (socket) => {
  console.log("socket connected with id: " + socket.id);

  socket.on("find-game", (data) => {
    const userPlayer = { user: data, socketId: socket.id };
    QUEUE[socket.id] = userPlayer;
    console.log("player added to queue");
  });

  socket.on("set-finish-draw-phase", (data) => {
    io.to(data.opponentSocketId).emit("get-finish-draw-phase", {
      playerData: data.playerData,
    });
  });

  socket.on("on-card-put-player", (data) => {
    io.to(data.opponentSocketId).emit("on-card-put-opponent", data.playerData);
  });

  socket.on("set-end-turn", (data) => {
    io.to(data.opponentSocketId).emit("get-end-turn", data.gameState);
  });

  socket.on("set-battle-phase", (data) => {
    io.to(data.opponentSocketId).emit("get-battle-phase");
  });

  socket.on("do-battle", (data) => {
    io.to(data.opponentSocketId).emit("do-battle", data.gameState);
  });

  socket.on("on-card-effect", (gameData: IGameData) => {
    const card = CARDS[gameData.card.uuid!] as ICard;
    const effectData = card.activateEffect(gameData);
    io.to(gameData.opponentSocketId).emit("on-card-effect", {
      card: effectData.card,
      gameState: effectData.gameStateOpponent,
      owner: socket.id,
      effectData,
      effectId: gameData.effectId,
    });
    io.to(gameData.playerSocketId).emit("on-card-effect", {
      card: effectData.card,
      gameState: effectData.gameStatePlayer,
      owner: socket.id,
      effectData,
      effectId: gameData.effectId,
    });
  });

  socket.on("revert-card-effect", (gameData) => {
    let effectData;
    gameData.gameState.playerEffects.forEach((effect, index) => {
      // Calls effectData inside revert func in case there are
      // more than one effects needed to be reverted that turn
      if (effect.untilTurn === gameData.gameState.currentTurn) {
        const card = CARDS[effect.uuid] as ICard;
        effectData = card.revertCardEffect(
          effectData ? effectData : gameData,
          effect
        );
      }
    });

    if (effectData) {
      io.to(gameData.opponentSocketId).emit("revert-card-effect", {
        gameState: effectData.gameStateOpponent,
        owner: socket.id,
        effectData,
      });
      io.to(gameData.playerSocketId).emit("revert-card-effect", {
        gameState: effectData.gameStatePlayer,
        owner: socket.id,
        effectData,
      });
    }
  });

  setInterval(() => {
    let keys = Object.keys(QUEUE);
    if (keys.length > 1) {
      console.log("creating game");

      const playerOneSocketId = keys[Math.floor(keys.length * Math.random())];
      const playerOne = { ...QUEUE[playerOneSocketId] };
      delete QUEUE[playerOneSocketId];

      keys = Object.keys(QUEUE);
      const playerTwoSocketId = keys[Math.floor(keys.length * Math.random())];
      const playerTwo = { ...QUEUE[playerTwoSocketId] };
      delete QUEUE[playerTwoSocketId];

      const players = [playerOne, playerTwo];

      const playerOneDeck: ICard[] = [];
      const playerTwoDeck: ICard[] = [];

      const cards = ["EarthSoil", "SuperWarrior"];

      for (let card of cards) {
        const cardImport = require("./Data/Cards/" + card + ".ts").default;
        console.log(cardImport)
        const cardObj = new cardImport() as ICard;
        cardObj.uuid = v4();
        CARDS[cardObj.uuid!] = cardObj;
        playerOneDeck.push(cardObj);
        playerTwoDeck.push(cardObj);
      }

      const game = {
        id: v4(),
        playerOne,
        playerTwo,
        playerOneDeck,
        playerTwoDeck,
        turn: players[Math.floor(players.length * Math.random())],
      };

      io.to(playerOneSocketId).emit("game-found", game);
      io.to(playerTwoSocketId).emit("game-found", game);
    }
  }, 5000);
});
