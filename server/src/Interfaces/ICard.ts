import {IGameData} from "./IGameData";
import {IEffectData} from "./IEffectData";
import {IEffect} from "./IEffect";

export interface ICard {
    activateEffect: (gameData: IGameData) => IEffectData;
    revertCardEffect: (gameData: IGameData, effect: IEffect) => IEffectData;
    uuid: string | null;
    attack?: number;
    defense?: number;
    type?: string;
    category: string;
    effect?: boolean
}