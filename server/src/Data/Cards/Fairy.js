const { v4 } = require("uuid");

module.exports = class CardFairy {
  title = "Fairy";
  attack = 1300;
  defense = 500;
  effect = true;
  category = "monster";

  activateEffect({ gameState }) {
    gameState.playerMonsterFields.forEach((field) => {
      if (field.card && field.card.type === "earth") {
        field.card.attack += 500;
      }
    });

    return {
      card: {
        ...this,
      },
      forTurns: 3,
      gameStateOpponent: {
        opponentMonsterFields: gameState.playerMonsterFields,
      },
      gameStatePlayer: {
        playerMonsterFields: gameState.playerMonsterFields,
      },
    };
  }

  revertCardEffect({ gameState, type }) {
    let gameStateOpponent = {};
    let gameStatePlayer = {};

    if (type === "player") {
      gameState.playerMonsterFields.forEach((field) => {
        if (field.card && field.card.type === "earth") {
          field.card.attack -= 500;
        }
      });
      gameStateOpponent = {
        opponentMonsterFields: gameState.playerMonsterFields,
      };
      gameStatePlayer = {
        playerMonsterFields: gameState.playerMonsterFields,
      };
    } else if (type === "opponent") {
      gameState.opponentMonsterFields.forEach((field) => {
        if (field.card && field.card.type === "earth") {
          field.card.attack -= 500;
        }
      });
      gameStateOpponent = {
        playerMonsterFields: gameState.opponentMonsterFields,
      };
      gameStatePlayer = {
        opponentMonsterFields: gameState.opponentMonsterFields,
      };
    }

    return {
      card: {
        ...this,
      },
      gameStateOpponent,
      gameStatePlayer,
    };
  }
};
