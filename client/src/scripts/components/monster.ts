import { MonsterAttack, MonsterMove, MonsterState } from '../../types/monster';

class Monster {
  x: number;

  y: number;

  w: number;

  h: number;

  state: MonsterState;

  moveDir: MonsterMove;

  attackDir: MonsterAttack;

  stepSize: number;

  health: number;

  randomSteps: number;

  moveTicks: number;

  moveTicksMax: number;

  sprite: HTMLElement;

  attackElement: HTMLElement;

  levelArea: HTMLElement;

  bonus: number;

  constructor() {
    this.sprite = document.createElement('div');
  }

  setPosition(): void {
    this.sprite.style.transform = `translate(${this.x}px, ${this.y}px)`;
  }

  swapMoving(): void {
    if (this.moveDir === MonsterMove.RIGHT) {
      this.moveDir = MonsterMove.LEFT;
    } else if (this.moveDir === MonsterMove.LEFT) {
      this.moveDir = MonsterMove.RIGHT;
    }
  }

  getAttacked(): void {
    this.health -= 1;
    if (this.health > 0) {
      this.sprite.classList.add('attacked');
      setTimeout(() => {
        this.sprite.classList.remove('attacked');
      }, 200);
    }
  }

  removeSprite(): void {
    this.sprite.remove();
  }

  setRandomSteps(): void {
    this.randomSteps = Math.ceil(Math.random() * 7);
  }
}

export default Monster;
