import Death from '../enums/death';

export interface IDeathAnimator {
  death(death: Death): void
}
