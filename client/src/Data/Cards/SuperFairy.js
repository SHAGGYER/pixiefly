import GameService from '../../Services/GameService';
import { v4 } from 'uuid';

export default class CardSuperFairy {
  title = 'Super Fairy';
  attack = 2300;
  defense = 900;
  uuid = v4();
  isBack = false;
  effectUsed = false;

  effect(gameState) {
    if (!this.effectUsed) {
      const _gameState = { ...gameState };
      _gameState.opponentMonsterEffects.push({
        endsOnTurn: _gameState.currentTurn + 1,
        uuid: this.uuid,
      });
      this.attack += 300;
      this.effectUsed = true;
      return [this, _gameState];
    }

    return [];
  }

  revertEffect(gameState) {
    this.attack -= 300;
    return [this];
  }
}
