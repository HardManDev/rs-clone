import '@styles/zombie';

class Zombie {
  X = 0;

  Y = 0;

  W = 100;

  H = 200;

  movingLeft = false;

  movingRight = true;

  movingUp = false;

  movingDown = false;

  sprite: HTMLElement = document.createElement('div');

  constructor(x: number, y: number) {
    this.sprite.classList.add('zombie');
    this.X = x;
    this.Y = y;
    this.sprite.style.width = `${this.W}px`;
    this.sprite.style.height = `${this.H}px`;
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
    this.sprite.style.transform = `translate(${this.X}px, ${this.Y}px)`;
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
