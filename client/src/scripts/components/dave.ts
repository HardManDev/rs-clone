class Player {
  x = 0;

  y = 0;

  w = 60;

  h = 96;

  lookingLeft = false;

  lookingRight = false;

  movingLeft = false;

  movingRight = false;

  falling = false;

  movingUp = false;

  movingDown = false;

  stopped = false;

  jumping = false;

  lookingDown = false;

  lookingUp = false;

  startJumpingDown = false;

  sprite: HTMLElement = document.createElement('div');

  velicity = 0;

  jumpStartVelocity = 10;

  constructor() {
    this.sprite.classList.add('player');
    this.sprite.style.width = `${this.w}px`;
    this.sprite.style.height = `${this.h}px`;
  }

  setView(): void {
    if (this.falling) {
      if (this.lookingLeft) {
        this.sprite.innerHTML = '<svg fill="#000000" height="100px" width="60px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 347.341 347.341" xml:space="preserve"><polygon points="347.34,21.213 326.127,0 30,296.128 30,247.487 0,247.487 0,347.341 99.854,347.34 99.854,317.34 51.214,317.34 "/></svg>';
      } else if (this.lookingRight) {
        this.sprite.innerHTML = '<svg fill="#000000" height="100px" width="60px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 347.341 347.341" xml:space="preserve"><polygon points="247.487,347.341 347.341,347.34 347.34,247.487 317.34,247.487 317.34,296.127 21.213,0 0,21.213 296.127,317.34 247.487,317.341 "/></svg>';
      }
    } else if (this.jumping) {
      if (this.lookingLeft) {
        this.sprite.innerHTML = '<svg fill="#000000" height="100px" width="60px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 347.341 347.341" xml:space="preserve"><polygon points="347.34,326.127 51.213,30 184.706,30 184.706,0 0,0 0,184.706 30,184.706 30,51.213 326.127,347.341 "/></svg>';
      } else if (this.lookingRight) {
        this.sprite.innerHTML = '<svg fill="#000000" height="100px" width="60px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 347.341 347.341" xml:space="preserve"><polygon points="347.341,107.783 347.339,0 239.559,0.002 282.843,43.285 0,326.128 21.213,347.341 304.056,64.498 "/></svg>';
      }
    } else if (this.movingLeft || this.lookingLeft) {
      this.sprite.innerHTML = '<svg fill="#000000" height="100px" width="60px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 476.213 476.213" xml:space="preserve"><polygon points="476.213,223.107 76.212,223.107 76.212,161.893 0,238.108 76.212,314.32 76.212,253.107 476.213,253.107 "/></svg>';
    } else if (this.movingRight || this.lookingRight) {
      this.sprite.innerHTML = '<svg fill="#000000" height="100px" width="60px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 476.213 476.213" xml:space="preserve"><polygon points="476.213,238.105 400,161.893 400,223.106 0,223.106 0,253.106 400,253.106 400,314.32 "/></svg>';
    }
  }

  correctPosByDiff(dX: number, dY: number, playgroundW: number, playgroundH: number): void {
    this.x += dX;
    this.y += dY;
    if (this.x < 0) {
      this.x = 0;
    }
    if (this.y < 0) {
      this.y = 0;
    }
    if (this.x > playgroundW - this.w) {
      this.x = playgroundW - this.w;
    }
    if (this.y > playgroundH - this.h) {
      this.y = playgroundH - this.h;
    }
    this.sprite.style.transform = `translate(${this.x}px, ${this.y}px)`;
  }
}

export default Player;
