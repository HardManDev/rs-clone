import '@styles/dave';
import {
  LeftFeet, Offset,
} from '../../types/game';
import {
  DaveLook, DaveMove, DaveShoot, DaveState,
} from '../../types/dave';
import PlayAnimator from '../controllers/playAnimator';
import Direction from '../../types/enums/directions';
import DeathAnimator from '../controllers/deathAnimator';
import Death from '../../types/enums/death';

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

  animation: PlayAnimator;

  deathAnimation: DeathAnimator;

  deathLayer: HTMLElement;

  bullets = 8;

  bulletsMax = 8;

  constructor(leftFeet: LeftFeet) {
    this.sprite.classList.add('player');
    this.x = leftFeet.x;
    this.y = leftFeet.y - this.h;
    this.setPosition();
    this.animation = new PlayAnimator(this.sprite);
    this.deathLayer = document.createElement('div');
    this.deathAnimation = new DeathAnimator(this.deathLayer);
    this.sprite.append(this.deathLayer);
  }

  setView(): void {
    const centerLook: Direction = this.look === DaveLook.LEFT
      ? Direction.LEFT
      : Direction.RIGHT;
    const upLook: Direction = this.look === DaveLook.LEFT
      ? Direction.TOP_LEFT
      : Direction.TOP_RIGHT;
    const downLook: Direction = this.look === DaveLook.LEFT
      ? Direction.DOWN_LEFT
      : Direction.DOWN_RIGHT;
    if (this.state === DaveState.FALLING) {
      this.animation.fall(centerLook);
    } else if (this.state === DaveState.JUMPING_UP) {
      this.animation.jump(centerLook);
    } else if (this.state === DaveState.SHOOTING
      || this.state === DaveState.STUCK) {
      if (this.shoot === DaveShoot.UP) {
        this.animation.shoot(upLook);
      } else if (this.shoot === DaveShoot.DOWN) {
        this.animation.shoot(downLook);
      } else {
        this.animation.shoot(centerLook);
      }
    } else if (this.state === DaveState.RUNNING) {
      this.animation.move(centerLook);
    } else if (this.state === DaveState.STANDING) {
      if (this.shoot === DaveShoot.UP) {
        this.animation.look(upLook);
      } else if (this.shoot === DaveShoot.DOWN) {
        this.animation.look(downLook);
      } else {
        this.animation.look(centerLook);
      }
    } else if (this.state === DaveState.RECHARGING) {
      this.animation.reload();
    } else if (this.state === DaveState.EXITING) {
      this.animation.exit();
    } else {
      this.animation.look(centerLook);
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

  showDeathLayer(death: Death): void {
    this.deathAnimation.death(death);
    this.deathLayer.style.display = 'block';
  }
}

export default Player;
