module.exports = class CardDarkHole {
  title = "Dark Hole";
  effect = true;
  category = "magic";
  destroyOnActivate = true;

  activateEffect({ gameState, card }) {
    const index = gameState.playerMagicFields.findIndex(
      (field) => field.card.uuid === card.uuid
    );
    gameState.playerMagicFields.splice(index, 1, {});

    return {
      card: {
        ...this,
      },
      gameStateOpponent: {
        playerMonsterFields: [{}, {}, {}, {}, {}],
        opponentMagicFields: gameState.playerMagicFields,
      },
      gameStatePlayer: {
        opponentMonsterFields: [{}, {}, {}, {}, {}],
        playerMagicFields: gameState.playerMagicFields,
      },
    };
  }
};
