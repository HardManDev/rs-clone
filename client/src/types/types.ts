export type Rect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type LeftFeet = {
  x: number;
  y: number;
};

export enum LevelEntity {
  WALL = '1',
  PLATFORM = '2',
  ZOMBIE = 'Z',
  DAVE = 'D',
}
export type Offset = [number, number];

export enum DaveState {
  STANDING,
  RUNNING,
  JUMPING_DOWN,
  JUMPING_UP,
  FALLING,
  SHOOTING,
  RECHARGING,
  STUCK,
}

export enum DaveMove {
  LEFT,
  RIGHT,
  NONE,
}

export enum DaveLook {
  LEFT,
  RIGHT,
}

export enum DaveShoot {
  UP,
  CENTER,
  DOWN,
}
