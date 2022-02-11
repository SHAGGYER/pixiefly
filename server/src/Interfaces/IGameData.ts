import {ICard} from "./ICard";
import {IGameState} from "./IGameState";

export interface IGameData {
    gameState: IGameState;
    card: ICard;
    opponentSocketId: string;
    playerSocketId: string;
    effectId: string;
    type?: string
    gameStatePlayer?: IGameState;
    gameStateOpponent?: IGameState
}