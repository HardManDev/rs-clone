import Direction from '../enums/directions';

export interface IPlayerAnimator {
  move(direction: Direction): void
  jump(direction: Direction): void
  fall(direction: Direction): void
  reload(): void
  shoot(direction: Direction): void
  look(direction: Direction): void
  exit(): void
}
