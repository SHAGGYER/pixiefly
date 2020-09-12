import GameService from '../../Services/GameService';
import { v4 } from 'uuid';

export default class CardSuperWarrior {
  title = 'Super Warrior';
  attack = 2500;
  defense = 1200;
  uuid = v4();
}
