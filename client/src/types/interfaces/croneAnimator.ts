import Direction from '../enums/directions';

export interface ICroneAnimator {
  move(direction: Direction): void
  attack(direction: Direction): void
}
