import { Rect } from './game';

export enum MonsterState {
  STANDING,
  MOVING,
  JUMPING_DOWN,
  JUMPING_UP,
  ATTACKING,
}

export enum MonsterMove {
  LEFT,
  RIGHT,
  NONE,
}

export enum MonsterAttack {
  LEFT,
  RIGHT,
}

export type Bullet = {
  area: Rect;
  sprite: HTMLElement;
  movedDir?: BulletMove;
};

export enum BulletMove {
  LEFT,
  RIGHT,
}
