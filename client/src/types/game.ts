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

export type Line = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};
