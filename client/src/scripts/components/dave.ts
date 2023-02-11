import '@styles/dave';
import {
  LeftFeet, Offset,
} from '../../types/game';
import {
  DaveLook, DaveMove, DaveShoot, DaveState,
} from '../../types/dave';
import PlayAnimator from '../controllers/playAnimator';
import Direction from '../../types/enums/directions';

class Player {
  x = 0;

  y = 0;

  w = 72;

  h = 96;

  state: DaveState = DaveState.STANDING;

  look: DaveLook = DaveLook.RIGHT;

  shoot: DaveShoot = DaveShoot.CENTER;

  move: DaveMove = DaveMove.NONE;

  sprite: HTMLElement = document.createElement('div');

  velocity = 0;

  stepSize = 8;

  shootOffsetY = 10;

  jumpStartVelocity = 8;

  lives = 3;

  animation: PlayAnimator;

  constructor(leftFeet: LeftFeet) {
    this.sprite.classList.add('player');
    this.x = leftFeet.x;
    this.y = leftFeet.y - this.h;
    this.sprite.style.width = `${this.w}px`;
    this.sprite.style.height = `${this.h}px`;
    this.setPosition();
    this.animation = new PlayAnimator(this.sprite);
  }

  setView(): void {
    if (this.state === DaveState.FALLING) {
      this.animation.fall(
        this.look === DaveLook.LEFT
          ? Direction.RIGHT
          : Direction.LEFT,
      );
    } else if (this.state === DaveState.JUMPING_UP) {
      this.animation.jump(
        this.look === DaveLook.LEFT
          ? Direction.RIGHT
          : Direction.LEFT,
      );
    } else if (this.state === DaveState.SHOOTING) {
      if (this.shoot === DaveShoot.UP) {
        this.animation.shoot(
          this.look === DaveLook.LEFT
            ? Direction.TOP_LEFT
            : Direction.TOP_RIGHT,
        );
      } else if (this.shoot === DaveShoot.DOWN) {
        this.animation.shoot(
          this.look === DaveLook.LEFT
            ? Direction.DOWN_LEFT
            : Direction.DOWN_RIGHT,
        );
      } else {
        this.animation.shoot(
          this.look === DaveLook.LEFT
            ? Direction.LEFT
            : Direction.RIGHT,
        );
      }
    } else if (this.state === DaveState.RUNNING) {
      this.animation.move(
        this.look === DaveLook.LEFT
          ? Direction.LEFT
          : Direction.RIGHT,
      );
    } else if (this.state === DaveState.STANDING) {
      if (this.shoot === DaveShoot.UP) {
        this.animation.look(
          this.look === DaveLook.LEFT
            ? Direction.TOP_LEFT
            : Direction.TOP_RIGHT,
        );
      } else if (this.shoot === DaveShoot.DOWN) {
        this.animation.look(
          this.look === DaveLook.LEFT
            ? Direction.DOWN_LEFT
            : Direction.DOWN_RIGHT,
        );
      } else {
        this.animation.look(
          this.look === DaveLook.LEFT
            ? Direction.LEFT
            : Direction.RIGHT,
        );
      }
    }
  }

  showShootLine(
    canvas: HTMLCanvasElement,
    canvasData: ImageData,
    offset: Offset,
  ): void {
    const fromX: number = this.x + this.w / 2;
    const fromY: number = this.y + this.h / 2 - this.shootOffsetY;
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');

    if (ctx) {
      ctx.putImageData(canvasData, 0, 0);
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(fromX, fromY);
      ctx.lineTo(fromX + offset[0], fromY + offset[1]);
      ctx.stroke();
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
