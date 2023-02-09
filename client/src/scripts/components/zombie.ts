import '@styles/zombie';
import { LeftFeet } from '../../types/game';

class Zombie {
  x = 0;

  y = 0;

  w = 64;

  h = 120;

  movingLeft = false;

  movingRight = true;

  movingUp = false;

  movingDown = false;

  stepSize = 16;

  sprite: HTMLElement = document.createElement('div');

  constructor(leftFeet: LeftFeet) {
    this.sprite.classList.add('zombie');
    this.x = leftFeet.x;
    this.y = leftFeet.y - this.h;
    this.sprite.style.width = `${this.w}px`;
    this.sprite.style.height = `${this.h}px`;
    this.setPosition();
  }

  setView(): void {
    if (this.movingLeft) {
      this.sprite.innerHTML = '<svg fill="#000000" height="100px" width="100px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 476.213 476.213" xml:space="preserve"><polygon points="476.213,223.107 76.212,223.107 76.212,161.893 0,238.108 76.212,314.32 76.212,253.107 476.213,253.107 "/></svg>';
    } else if (this.movingRight) {
      this.sprite.innerHTML = '<svg fill="#000000" height="100px" width="100px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 476.213 476.213" xml:space="preserve"><polygon points="476.213,238.105 400,161.893 400,223.106 0,223.106 0,253.106 400,253.106 400,314.32 "/></svg>';
    }
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
}

export default Zombie;
