import {IGameState} from "./IGameState";
import {ICard} from "./ICard";

export interface IEffectData {
    gameState?: IGameState
    gameStateOpponent?: IGameState;
    gameStatePlayer?: IGameState;
    card?: ICard;
    forTurns?: number;
    type?: string
}