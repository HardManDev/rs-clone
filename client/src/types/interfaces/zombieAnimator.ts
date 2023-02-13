import Direction from '../enums/directions';

export interface IZombieAnimator {
  move(direction: Direction): void
  attack(direction: Direction): void
}
