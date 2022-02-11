import {ICard} from "../../Interfaces/ICard";
import {IGameData} from "../../Interfaces/IGameData";
import {IEffectData} from "../../Interfaces/IEffectData";
import {IEffect} from "../../Interfaces/IEffect";

const { v4 } = require("uuid");

export default class CardSuperWarrior implements ICard {
  title = "Super Warrior";
  attack = 2500;
  defense = 1200;
  type = "earth";
  category = "monster";
  effect = true
  uuid = null

  activateEffect({ card }: IGameData): IEffectData {
    const effectData: IEffectData = {
      card: {
        ...this as unknown as ICard,
        attack: card.attack! + 500,
      },
      forTurns: 2,
    }

    return effectData
  }

  revertCardEffect(
    { gameState, type, gameStatePlayer, gameStateOpponent }: IGameData,
    effect: IEffect
  ): IEffectData {
    console.log("reverting")

    if (type === "player") {
      if (!gameStateOpponent) {
        gameStateOpponent = {};
      }

      if (!gameStatePlayer) {
        gameStatePlayer = {};
      }

      gameState.playerMonsterFields!.forEach((field) => {
        if (field.card && field.card.uuid === effect.uuid) {
          console.log("card found")
          field.card.attack -= 500;
        }
      });

    /*  gameStateOpponent.opponentEffects = gameState.playerEffects;
      gameStatePlayer.playerEffects = gameState.playerEffects;*/
      gameStateOpponent.opponentMonsterFields = gameState.playerMonsterFields;
      gameStatePlayer.playerMonsterFields = gameState.playerMonsterFields
    }

    return {
      gameState,
      type,
      gameStateOpponent,
      gameStatePlayer,
    };
  }
};
