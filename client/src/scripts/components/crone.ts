/* eslint-disable class-methods-use-this */
import '@styles/crone';
import { LeftFeet, Offset, Rect } from '../../types/game';
import {
  Bullet, BulletMove, MonsterAttack, MonsterMove, MonsterState,
} from '../../types/monster';
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

  bullet: Bullet[] = [];

  bulletOffsetX = 20;

  bulletOffsetY = 10;

  bulletW = 20;

  bulletH = 10;

  constructor(leftFeet: LeftFeet, levelArea: HTMLElement) {
    super();
    this.sprite.classList.add('crone');
    this.x = leftFeet.x;
    this.y = leftFeet.y - this.h;
    this.sprite.style.width = `${this.w}px`;
    this.sprite.style.height = `${this.h}px`;
    this.state = MonsterState.MOVING;
    this.moveDir = Math.random() > 0.5 ? MonsterMove.LEFT : MonsterMove.RIGHT;
    this.setPosition();
    this.levelArea = levelArea;
  }

  attack(): void {
    if (this.state === MonsterState.ATTACKING) {
      if (this.attackDir === MonsterAttack.LEFT) {
        this.createBullet(
          {
            x: this.x + this.bulletOffsetX,
            y: this.y + this.bulletOffsetY,
            w: this.bulletW,
            h: this.bulletH,
          },
          BulletMove.LEFT,
        );
      } else if (this.attackDir === MonsterAttack.RIGHT) {
        this.createBullet(
          {
            x: this.x + this.w - this.bulletOffsetX,
            y: this.y + this.bulletOffsetY,
            w: this.bulletW,
            h: this.bulletH,
          },
          BulletMove.RIGHT,
        );
      }
      setTimeout(() => {
        this.state = MonsterState.MOVING;
      }, 500);
    }
  }

  createBullet(area: Rect, bulletDir: BulletMove): void {
    const bullet: Bullet = {
      area,
      sprite: document.createElement('div'),
    };
    bullet.area = area;
    bullet.sprite = document.createElement('div');
    bullet.sprite.classList.add('crone_bullet');
    bullet.sprite.style.width = `${area.w}px`;
    bullet.sprite.style.height = `${area.h}px`;
    bullet.sprite.style.transform = `translate(${area.x}px, ${area.y}px)`;
    bullet.movedDir = bulletDir;
    this.bullet.push(bullet);
    this.levelArea.append(bullet.sprite);
  }

  removeBullet(bullet: Bullet): void {
    bullet.sprite.remove();
    this.bullet.splice(this.bullet.indexOf(bullet), 1);
  }

  moveBullet(bullet: Bullet, offset: Offset): void {
    bullet.area.x += offset[0];
    bullet.area.y += offset[1];
    bullet.sprite.style.transform = `translate(${bullet.area.x}px, ${bullet.area.y}px)`;
  }
}

export default Crone;
