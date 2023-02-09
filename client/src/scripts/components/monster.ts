import { LeftFeet } from '../../types/game';

class Monster {
  x: number;

  y: number;

  w: number;

  h: number;

  movingLeft: boolean;

  movingRight: boolean;

  movingUp: boolean;

  movingDown: boolean;

  stepSize: number;

  health: number;

  randomSteps: number;

  moveTicks: number;

  moveTicksMax: number;

  sprite: HTMLElement;

  constructor() {
    this.sprite = document.createElement('div');
  }

  setPosition(): void {
    this.sprite.style.transform = `translate(${this.x}px, ${this.y}px)`;
  }

  swapMoving(): void {
    if (this.movingRight) {
      this.movingRight = false;
      this.movingLeft = true;
    } else if (this.movingLeft) {
      this.movingRight = true;
      this.movingLeft = false;
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
