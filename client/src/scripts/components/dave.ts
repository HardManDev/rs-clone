import '@styles/dave';
import {
  LeftFeet,
} from '../../types/game';
import {
  DaveLook, DaveMove, DaveShoot, DaveState,
} from '../../types/dave';
class Player {
  x = 0;

  y = 0;

  w = 64;

  h = 96;

  state: DaveState = DaveState.STANDING;

  look: DaveLook = DaveLook.RIGHT;

  shoot: DaveShoot = DaveShoot.CENTER;

  move: DaveMove = DaveMove.NONE;

  sprite: HTMLElement = document.createElement('div');

  velocity = 0;

  stepSize = 8;

  jumpStartVelocity = 8;

  constructor(leftFeet: LeftFeet) {
    this.sprite.classList.add('player');
    this.x = leftFeet.x;
    this.y = leftFeet.y - this.h;
    this.sprite.style.width = `${this.w}px`;
    this.sprite.style.height = `${this.h}px`;
    this.setPosition();
  }

  setView(): void {
    console.log(this.state);
    if (this.state === DaveState.FALLING) {
      if (this.look === DaveLook.LEFT) {
        this.sprite.innerHTML = '<svg fill="#000000" height="100px" width="60px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 347.341 347.341" xml:space="preserve"><polygon points="347.34,21.213 326.127,0 30,296.128 30,247.487 0,247.487 0,347.341 99.854,347.34 99.854,317.34 51.214,317.34 "/></svg>';
      } else if (this.look === DaveLook.RIGHT) {
        this.sprite.innerHTML = '<svg fill="#000000" height="100px" width="60px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 347.341 347.341" xml:space="preserve"><polygon points="247.487,347.341 347.341,347.34 347.34,247.487 317.34,247.487 317.34,296.127 21.213,0 0,21.213 296.127,317.34 247.487,317.341 "/></svg>';
      }
    } else if (this.state === DaveState.JUMPING_UP) {
      if (this.look === DaveLook.LEFT) {
        this.sprite.innerHTML = '<svg fill="#000000" height="100px" width="60px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 347.341 347.341" xml:space="preserve"><polygon points="347.34,326.127 51.213,30 184.706,30 184.706,0 0,0 0,184.706 30,184.706 30,51.213 326.127,347.341 "/></svg>';
      } else if (this.look === DaveLook.RIGHT) {
        this.sprite.innerHTML = '<svg fill="#000000" height="100px" width="60px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 347.341 347.341" xml:space="preserve"><polygon points="347.341,107.783 347.339,0 239.559,0.002 282.843,43.285 0,326.128 21.213,347.341 304.056,64.498 "/></svg>';
      }
    } else if (this.shoot === DaveShoot.UP) {
      this.sprite.innerHTML = 'Shooting UP';
    } else if (this.shoot === DaveShoot.DOWN) {
      this.sprite.innerHTML = 'Shooting DOWN';
    } else if (this.look === DaveLook.LEFT) {
      this.sprite.innerHTML = '<svg fill="#000000" height="100px" width="60px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 476.213 476.213" xml:space="preserve"><polygon points="476.213,223.107 76.212,223.107 76.212,161.893 0,238.108 76.212,314.32 76.212,253.107 476.213,253.107 "/></svg>';
    } else if (this.look === DaveLook.RIGHT) {
      this.sprite.innerHTML = '<svg fill="#000000" height="100px" width="60px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 476.213 476.213" xml:space="preserve"><polygon points="476.213,238.105 400,161.893 400,223.106 0,223.106 0,253.106 400,253.106 400,314.32 "/></svg>';
    }
  }

  correctPosByDiff(
    dX: number,
    dY: number,
    levelW: number,
    levelH: number,
  ): void {
    this.x += dX;
    this.y += dY;
    if (this.x < 0) {
      this.x = 0;
    }
    if (this.y < 0) {
      this.y = 0;
    }
    if (this.x > levelW - this.w) {
      this.x = levelW - this.w;
    }
    if (this.y > levelH - this.h) {
      this.y = levelH - this.h;
    }
    this.sprite.style.transform = `translate(${this.x}px, ${this.y}px)`;
  }

  setPosition(): void {
    this.sprite.style.transform = `translate(${this.x}px, ${this.y}px)`;
  }
}

export default Player;
