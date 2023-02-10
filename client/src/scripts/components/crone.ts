import '@styles/crone';
import { LeftFeet } from '../../types/game';
import Monster from './monster';

class Crone extends Monster {
  x = 0;

  y = 0;

  w = 64;

  h = 72;

  movingLeft = false;

  movingRight = true;

  stepSize = 24;

  health = 2;

  randomSteps = 0;

  moveTicks = 2;

  moveTicksMax = 2;

  sprite: HTMLElement = document.createElement('div');

  constructor(leftFeet: LeftFeet) {
    super();
    this.sprite.classList.add('crone');
    this.x = leftFeet.x;
    this.y = leftFeet.y - this.h;
    this.sprite.style.width = `${this.w}px`;
    this.sprite.style.height = `${this.h}px`;
    this.setPosition();
  }
}

export default Crone;
