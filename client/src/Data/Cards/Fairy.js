import GameService from '../../Services/GameService';
import { v4 } from 'uuid';

export default class CardFairy {
  title = 'Fairy';
  attack = 1300;
  defense = 500;
  uuid = v4();
  isBack = false;
}
