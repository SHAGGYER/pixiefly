module.exports = class CardEarthSoil {
  title = "Earth Soil";
  effect = true;
  category = "magic";
  forTurns = 4;

  activateEffect({ gameState, card, effectId }) {
    const monsterFieldEffectExists = !!gameState.playerMonsterFields.find(
      (field) =>
        field.card &&
        field.card.additionEffects &&
        field.card.additionEffects.includes(effectId)
    );
    if (!monsterFieldEffectExists) {
      gameState.playerMonsterFields.forEach((field) => {
        if (field.card && field.card.type === "earth") {
          field.card.attack += 500;
          if (!field.card.additionEffects) {
            field.card.additionEffects = [effectId];
          } else {
            field.card.additionEffects.push(effectId);
          }
        }
      });
    }

    const effect = gameState.playerEffects.find((e) => e.uuid === card.uuid);
    if (!effect) {
      gameState.playerEffects.push({
        ...this,
        untilTurn: this.forTurns + gameState.currentTurn,
        effectId,
      });
    }

    return {
      card: {
        ...this,
      },
      gameStateOpponent: {
        opponentMonsterFields: gameState.playerMonsterFields,
        opponentEffects: gameState.playerEffects,
      },
      gameStatePlayer: {
        playerMonsterFields: gameState.playerMonsterFields,
        playerEffects: gameState.playerEffects,
      },
    };
  }

  revertCardEffect(
    { gameState, type, gameStateOpponent, gameStatePlayer },
    effect
  ) {
    if (type === "player") {
      const index = gameState.playerMagicFields.findIndex(
        (field) => field.card && field.card.uuid === effect.uuid
      );
      if (index >= 0) {
        gameState.playerMagicFields.splice(index, 1, {});
      }

      gameState.playerMonsterFields.forEach((field) => {
        if (field.card && field.card.type === "earth") {
          field.card.attack -= 500;
        }
      });

      if (!gameStateOpponent) {
        gameStateOpponent = {};
      }

      if (!gameStatePlayer) {
        gameStatePlayer = {};
      }

      gameStateOpponent.opponentMonsterFields = gameState.playerMonsterFields;
      gameStateOpponent.opponentMagicFields = gameState.playerMagicFields;
      gameStateOpponent.opponentEffects = gameState.playerEffects;

      gameStatePlayer.playerMonsterFields = gameState.playerMonsterFields;
      gameStatePlayer.playerMagicFields = gameState.playerMagicFields;
      gameStatePlayer.playerEffects = gameState.playerEffects;
    }
    // else if (type === "opponent") {
    //   const index = gameState.opponentMagicFields.findIndex(
    //     (field) => field.card && field.card.uuid === card.uuid
    //   );
    //   if (index >= 0) {
    //     gameState.opponentMagicFields.splice(index, 1, {});
    //   }

    //   const effectIndex = gameState.opponentEffects.findIndex(
    //     (effect) => effect.uuid === card.uuid
    //   );
    //   if (effectIndex >= 0) {
    //     gameState.opponentEffects.splice(index, 1);
    //   }

    //   gameState.opponentMonsterFields.forEach((field) => {
    //     if (field.card && field.card.type === "earth") {
    //       field.card.attack -= 500;
    //     }
    //   });
    //   gameStateOpponent = {
    //     playerMonsterFields: gameState.opponentMonsterFields,
    //     playerMagicFields: gameState.opponentMagicFields,
    //     playerEffects: gameState.opponentEffects,
    //   };
    //   gameStatePlayer = {
    //     opponentMonsterFields: gameState.opponentMonsterFields,
    //     opponentMagicFields: gameState.opponentMagicFields,
    //     opponentEffects: gameState.opponentEffects,
    //   };
    // }

    return {
      gameState,
      type,
      gameStateOpponent,
      gameStatePlayer,
    };
  }
};
