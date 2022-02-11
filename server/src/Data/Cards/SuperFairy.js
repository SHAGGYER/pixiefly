module.exports = class CardSuperFairy {
  title = "Super Fairy";
  attack = 2300;
  defense = 900;
  effect = true;
  type = "earth";
  category = "monster";

  activateEffect({ gameState }) {
    return {
      card: {
        ...this,
      },
      gameStateOpponent: {
        playerMonsterFields: [{}, {}, {}, {}, {}],
      },
      gameStatePlayer: {
        opponentMonsterFields: [{}, {}, {}, {}, {}],
      },
    };
  }
};
