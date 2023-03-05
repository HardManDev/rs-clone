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
  WALL = 'W',
  PLATFORM = 'P',
  ZOMBIE = 'Z',
  DAVE = 'D',
  CRONE = 'C',
  DOOR1 = '1',
  DOOR2 = '2',
  DOOR4 = '4',
  EXIT_DOOR = 'E',
}
export type Offset = [number, number];

export type Line = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export enum Position {
  NONE,
  LEFT,
  RIGHT,
}

export type Door = {
  area: Rect;
  sprite: HTMLElement;
  loot: Loot;
  opened: boolean;
};

export type ExitDoor = {
  area: Rect;
  sprite: HTMLElement;
  opened: boolean;
};

export type Loot = {
  area: Rect;
  sprite: HTMLElement;
  grabbed: boolean;
  bonus: number;
};

export enum DoorSize {
  W = 96,
  H = 144,
}

export enum LootSize {
  W = 40,
  H = 36,
}

export enum SoundType {
  JUMP,
  SHOT,
  LAND,
  BONUS1,
  EMPTY,
  RELOAD,
  START,
}

export type AllSound = {
  [key: string]: HTMLAudioElement;
};

export enum ObjectState {
  STANDING,
  JUMPING_UP,
  FALLING,
}

export type Movement = {
  x: MoveAxis,
  y: MoveAxis,
};

export type MoveAxis = {
  diff: number,
  accel: boolean,
  velocity: number,
};

export type Barrier = {
  above?: Rect,
  right?: Rect,
  below?: Rect,
  left?: Rect,
};
