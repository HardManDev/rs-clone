import {
  Line, Movement, Offset, Rect,
} from '../../types/game';

class Geometry {
  static getXOffset(move: Movement): Offset {
    return [move.x.diff, 0];
  }

  static getXYOffset(move: Movement): Offset {
    const v: number = move.y.velocity;
    return [move.x.diff, v > 0 ? v * 2 + 2 : v * 2 - 2];
  }

  static getCrossWithPlatforms(
    platforms: Rect[],
    rectCommon: Rect,
    rectStart: Rect,
  ): Rect[] {
    const crossPlatforms: Rect[] = [];
    for (let i = 0; i < platforms.length; i += 1) {
      if (
        rectCommon.x < platforms[i].x
        + platforms[i].w
        && rectCommon.x + rectCommon.w > platforms[i].x
        && rectCommon.y < platforms[i].y
        + platforms[i].h
        && rectCommon.h + rectCommon.y > platforms[i].y
        && rectStart.x < platforms[i].x
        + platforms[i].w
        && rectStart.x + rectStart.w > platforms[i].x
        && rectStart.y + rectStart.h <= platforms[i].y
      ) {
        crossPlatforms.push(platforms[i]);
      }
    }
    return crossPlatforms;
  }

  static getCrossWithWalls(walls: Rect[], rectCommon: Rect): Rect[] {
    const crossWalls: Rect[] = [];
    for (let i = 0; i < walls.length; i += 1) {
      if (Geometry.isRectCrossWithRect(rectCommon, walls[i])) {
        crossWalls.push(walls[i]);
      }
    }
    return crossWalls;
  }

  static isLineCrossLine(line1: Line, line2: Line): boolean {
    const x2x1: number = line1.x2 - line1.x1;
    const x4x3: number = line2.x2 - line2.x1;
    const y2y1: number = line1.y2 - line1.y1;
    const y4y3: number = line2.y2 - line2.y1;
    const x1x3: number = line1.x1 - line2.x1;
    const y1y3: number = line1.y1 - line2.y1;
    const d: number = (y4y3 * x2x1 - x4x3 * y2y1);
    const uA: number = (x4x3 * y1y3 - y4y3 * x1x3) / d;
    const uB: number = (x2x1 * y1y3 - y2y1 * x1x3) / d;
    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
      return true;
    }
    return false;
  }

  static isLineCrossRect(line: Line, rect: Rect): boolean {
    const left: boolean = this.isLineCrossLine(
      line,
      {
        x1: rect.x,
        y1: rect.y,
        x2: rect.x,
        y2: rect.y + rect.h,
      },
    );
    const right: boolean = this.isLineCrossLine(
      line,
      {
        x1: rect.x + rect.w,
        y1: rect.y,
        x2: rect.x + rect.w,
        y2: rect.y + rect.h,
      },
    );
    const top: boolean = this.isLineCrossLine(
      line,
      {
        x1: rect.x,
        y1: rect.y,
        x2: rect.x + rect.w,
        y2: rect.y,
      },
    );
    const bottom: boolean = this.isLineCrossLine(
      line,
      {
        x1: rect.x,
        y1: rect.y + rect.h,
        x2: rect.x + rect.w,
        y2: rect.y + rect.h,
      },
    );
    return !!((left || right || top || bottom));
  }

  static isRectCrossWithRect(rect1: Rect, rect2: Rect): boolean {
    return !!((rect1.x < rect2.x + rect2.w
        && rect1.x + rect1.w > rect2.x
        && rect1.y < rect2.y + rect2.h
        && rect1.h + rect1.y > rect2.y
    ));
  }

  static getRectAfterOffset(rect: Rect, offset: Offset): Rect {
    return {
      x: rect.x + ((offset[0] < 0) ? offset[0] : 0),
      y: rect.y + ((offset[1] < 0) ? offset[1] : 0),
      w: rect.w + ((offset[0] > 0) ? offset[0] : 0),
      h: rect.h + ((offset[1] > 0) ? offset[1] : 0),
    };
  }
}

export default Geometry;
