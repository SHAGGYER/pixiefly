import {ICard} from "../../Interfaces/ICard";
import {IEffectData} from "../../Interfaces/IEffectData";
import {IGameData} from "../../Interfaces/IGameData";
import {IEffect} from "../../Interfaces/IEffect";

export default class CardEarthSoil implements ICard {
  title = "Earth Soil";
  effect = true;
  category = "magic";
  forTurns = 4;
  uuid = null;

  public activateEffect({ gameState, card, effectId }): IEffectData {
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
        ...this as unknown as ICard,
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
    { gameState, type, gameStateOpponent, gameStatePlayer }: IGameData,
    effect: IEffect
  ): IEffectData {
    if (type === "player") {
      const index = gameState.playerMagicFields!.findIndex(
        (field) => field.card && field.card.uuid === effect.uuid
      );
      if (index >= 0) {
        gameState.playerMagicFields!.splice(index, 1, {});
      }

      gameState.playerMonsterFields!.forEach((field) => {
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

    return {
      gameState,
      type,
      gameStateOpponent,
      gameStatePlayer,
    };
  }
};
