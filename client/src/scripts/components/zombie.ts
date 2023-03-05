import '@styles/zombie';
import Direction from '../../types/enums/directions';
import { LeftFeet, Rect } from '../../types/game';
import {
  Bullet, MonsterAttack, MonsterMove, MonsterState,
} from '../../types/monster';
import ZombieAnimator from '../controllers/zombieAnimator';
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

  bullet: Bullet | undefined;

  bonus = 100;

  animation: ZombieAnimator;

  constructor(leftFeet: LeftFeet, levelArea: HTMLElement) {
    super();
    this.sprite.classList.add('zombie');
    this.x = leftFeet.x;
    this.y = leftFeet.y - this.h;
    this.sprite.style.width = `${this.w}px`;
    this.sprite.style.height = `${this.h}px`;
    this.state = MonsterState.MOVING;
    this.moveDir = Math.random() > 0.5 ? MonsterMove.LEFT : MonsterMove.RIGHT;
    this.setPosition();
    this.levelArea = levelArea;
    this.animation = new ZombieAnimator(this.sprite);
  }

  setView(): void {
    const centerLook: Direction = this.moveDir === MonsterMove.LEFT
      ? Direction.LEFT
      : Direction.RIGHT;
    const shootLook: Direction = this.attackDir === MonsterAttack.LEFT
      ? Direction.LEFT
      : Direction.RIGHT;
    if (this.state === MonsterState.MOVING) {
      this.animation.move(centerLook);
    }
    if (this.state === MonsterState.ATTACKING) {
      this.animation.attack(shootLook);
    }
  }

  attack(): void {
    if (this.state === MonsterState.ATTACKING) {
      if (this.attackDir === MonsterAttack.LEFT) {
        this.createBullet({
          x: this.x - this.w,
          y: this.y,
          w: this.w * 2,
          h: this.h,
        });
      } else if (this.attackDir === MonsterAttack.RIGHT) {
        this.createBullet({
          x: this.x,
          y: this.y,
          w: this.w * 2,
          h: this.h,
        });
      }
      setTimeout(() => {
        this.state = MonsterState.MOVING;
        this.removeBullet();
      }, 500);
    }
  }

  createBullet(area: Rect): void {
    const bullet: Bullet = {
      area,
      sprite: document.createElement('div'),
    };
    bullet.area = area;
    bullet.sprite = document.createElement('div');
    bullet.sprite.classList.add('zombie_bullet');
    bullet.sprite.style.width = `${area.w}px`;
    bullet.sprite.style.height = `${area.h}px`;
    bullet.sprite.style.transform = `translate(${area.x}px, ${area.y}px)`;
    this.bullet = bullet;
    this.levelArea.append(bullet.sprite);
  }

  removeBullet(): void {
    this.bullet?.sprite.remove();
    this.bullet = undefined;
  }

  removeAllBullets(): void {
    this.removeBullet();
  }
}

export default Zombie;
