const { v4 } = require("uuid");

module.exports = class CardSuperWarrior {
  title = "Super Warrior";
  attack = 2500;
  defense = 1200;
  type = "earth";
  category = "monster";
  effect = true;

  activateEffect({ gameState, card }) {
    return {
      card: {
        ...this,
        attack: card.attack + 500,
      },
      forTurns: 2,
    };
  }

  revertCardEffect(
    { gameState, type, gameStatePlayer, gameStateOpponent },
    effect
  ) {
    if (type === "player") {
      console.log("warriror");
      if (!gameStateOpponent) {
        gameStateOpponent = {};
      }

      if (!gameStatePlayer) {
        gameStatePlayer = {};
      }

      gameState.playerMonsterFields.forEach((field) => {
        if (field.card && field.card.uuid === effect.uuid) {
          console.log("found");
          field.card.attack -= 500;
        }
      });

      gameStateOpponent.opponentEffects = gameState.playerEffects;
      gameStatePlayer.playerEffects = gameState.playerEffects;
    } else {
      const index = gameState.opponentEffects.findIndex(
        (effect) => effect.uuid === card.uuid
      );
      if (index >= 0) {
        gameState.opponentEffects.splice(index, 1, {});
      }

      gameStateOpponent = {
        playerEffects: gameState.opponentEffects,
      };
      gameStatePlayer = {
        opponentEffects: gameState.opponentEffects,
      };
    }

    return {
      gameState,
      type,
      gameStateOpponent,
      gameStatePlayer,
    };
  }
};
