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
}
