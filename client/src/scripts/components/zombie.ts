import '@styles/zombie';
import { LeftFeet } from '../../types/game';
import Monster from './monster';

class Zombie extends Monster {
  x = 0;

  y = 0;

  w = 64;

  h = 120;

  movingLeft = false;

  movingRight = true;

  movingUp = false;

  movingDown = false;

  stepSize = 16;

  health = 2;

  randomSteps = 0;

  moveTicks = 4;

  moveTicksMax = 4;

  sprite: HTMLElement = document.createElement('div');

  constructor(leftFeet: LeftFeet) {
    super();
    this.sprite.classList.add('zombie');
    this.x = leftFeet.x;
    this.y = leftFeet.y - this.h;
    this.sprite.style.width = `${this.w}px`;
    this.sprite.style.height = `${this.h}px`;
    this.setPosition();
  }
}

export default Zombie;
