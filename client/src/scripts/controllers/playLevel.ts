/* eslint-disable class-methods-use-this */
import {
  Line, Offset, Rect,
} from '../../types/game';
import {
  DaveLook, DaveMove, DaveShoot, DaveState,
} from '../../types/dave';
import Player from '../components/dave';
import Zombie from '../components/zombie';
import GameView from '../components/game';

class PlayLevel {
  gameView: GameView;

  dave: Player;

  constructor() {
    this.gameView = new GameView();
  }

  startGame(): void {
    this.gameView.loadLevelEntities();
    this.dave = this.gameView.dave;
    this.animate();
    this.setListener();
    this.animateZombies();
  }

  getHorizontalDiffMovingLeftRight(): Offset {
    let dX = 0;
    if (this.dave.move === DaveMove.RIGHT) {
      dX = this.dave.stepSize;
    } else if (this.dave.move === DaveMove.LEFT) {
      dX = -this.dave.stepSize;
    }
    if (this.isCrossWithWalls({
      x: this.dave.x + ((dX < 0) ? dX : 0),
      y: this.dave.y,
      w: this.dave.w + ((dX > 0) ? dX : 0),
      h: this.dave.h,
    }).length === 0) {
      return [dX, 0];
    }
    return [0, 0];
  }

  getDiffFalling(): Offset {
    let dX = 0;
    let dY = 0;
    dY = this.dave.velocity * 2 + 2;
    if (this.dave.move === DaveMove.RIGHT) {
      dX = this.dave.stepSize;
    } else if (this.dave.move === DaveMove.LEFT) {
      dX = -this.dave.stepSize;
    }
    this.dave.velocity += 0.5;
    const walls: Rect[] = this.isCrossWithWalls({
      x: this.dave.x + ((dX < 0) ? dX : 0),
      y: this.dave.y + ((dY < 0) ? dY : 0),
      w: this.dave.w + ((dX > 0) ? dX : 0),
      h: this.dave.h + ((dY > 0) ? dY : 0),
    });
    const platforms: Rect[] = this.isCrossWithPlatforms(
      {
        x: this.dave.x + ((dX < 0) ? dX : 0),
        y: this.dave.y + ((dY < 0) ? dY : 0),
        w: this.dave.w + ((dX > 0) ? dX : 0),
        h: this.dave.h + ((dY > 0) ? dY : 0),
      },
      {
        x: this.dave.x,
        y: this.dave.w,
        w: this.dave.y,
        h: this.dave.h,
      },
    );
    if (platforms.length) {
      walls.push(...platforms);
    }

    if (walls.length !== 0) {
      let wallUnder: Rect | null = null;
      let wallLeft: Rect | null = null;
      let wallRight: Rect | null = null;
      for (let i = 0; i < walls.length; i += 1) {
        if (this.dave.x < walls[i].x + walls[i].w
        && this.dave.x + this.dave.w > walls[i].x
        && this.dave.y + this.dave.h <= walls[i].y) {
          wallUnder = walls[i];
        }
        if (dX > 0 && this.dave.x + dX + this.dave.w >= walls[i].x) {
          wallRight = walls[i];
        }
        if (dX < 0 && this.dave.x + dX <= walls[i].x + walls[i].w) {
          wallLeft = walls[i];
        }
      }
      if (wallUnder) {
        dY = wallUnder.y - this.dave.h - this.dave.y;
        this.dave.state = this.dave.move === DaveMove.NONE
          ? DaveState.STANDING
          : DaveState.RUNNING;
        this.dave.velocity = 0;
        if ((wallRight && dX > 0) || (wallLeft && dX < 0)) {
          dX = 0;
        }
      } else {
        dX = 0;
      }
    }
    return [dX, dY];
  }

  getDiffJumping(): Offset {
    let dX = 0;
    let dY = 0;
    dY = -this.dave.velocity * 2 - 2;
    if (this.dave.move === DaveMove.RIGHT) {
      dX = this.dave.stepSize;
    } else if (this.dave.move === DaveMove.LEFT) {
      dX = -this.dave.stepSize;
    }

    this.dave.velocity -= 0.5;
    const walls: Rect[] = this.isCrossWithWalls({
      x: this.dave.x + ((dX < 0) ? dX : 0),
      y: this.dave.y + ((dY < 0) ? dY : 0),
      w: this.dave.w + ((dX > 0) ? dX : 0),
      h: this.dave.h + ((dY > 0) ? dY : 0),
    });
    if (walls.length !== 0) {
      let wallAbove: Rect | null = null;
      let wallLeft: Rect | null = null;
      let wallRight: Rect | null = null;
      for (let i = 0; i < walls.length; i += 1) {
        if (this.dave.x < walls[i].x + walls[i].w
          && this.dave.x + this.dave.w > walls[i].x
          && this.dave.y >= walls[i].y + walls[i].h) {
          wallAbove = walls[i];
        }
        if (dX > 0 && this.dave.x + dX + this.dave.w >= walls[i].x) {
          wallRight = walls[i];
        }
        if (dX < 0 && this.dave.x + dX <= walls[i].x + walls[i].w) {
          wallLeft = walls[i];
        }
      }
      if (wallAbove) {
        dY = wallAbove.y + wallAbove.h - this.dave.y;
        this.dave.state = DaveState.FALLING;
        this.dave.velocity = 0;
        if ((wallRight && dX > 0) || (wallLeft && dX < 0)) {
          dX = 0;
        }
      } else {
        dX = 0;
      }
    }
    if (this.dave.velocity === 0) {
      this.dave.state = DaveState.FALLING;
    }
    return [dX, dY];
  }

  getDiffStartJumpingDown(): Offset {
    let dX = 0;
    let dY = this.dave.velocity * 2 + 2;
    if (this.dave.move === DaveMove.RIGHT) {
      dX = this.dave.stepSize;
    } else if (this.dave.move === DaveMove.LEFT) {
      dX = -this.dave.stepSize;
    }
    this.dave.state = DaveState.STANDING;
    this.dave.velocity += 0.5;
    const walls: Rect[] = this.isCrossWithWalls({
      x: this.dave.x + ((dX < 0) ? dX : 0),
      y: this.dave.y + ((dY < 0) ? dY : 0),
      w: this.dave.w + ((dX > 0) ? dX : 0),
      h: this.dave.h + ((dY > 0) ? dY : 0),
    });
    if (walls.length === 0) {
      this.dave.state = DaveState.FALLING;
    } else {
      dY = 0;
    }
    return [dX, dY];
  }

  getDiffShooting(): Offset {
    let dX = 0;
    if (this.dave.look === DaveLook.LEFT) {
      dX = this.dave.stepSize;
    } else if (this.dave.look === DaveLook.RIGHT) {
      dX = -this.dave.stepSize;
    }
    if (this.isCrossWithWalls({
      x: this.dave.x + ((dX < 0) ? dX : 0),
      y: this.dave.y,
      w: this.dave.w + ((dX > 0) ? dX : 0),
      h: this.dave.h,
    }).length === 0) {
      return [dX, 0];
    }
    return [0, 0];
  }

  animate(): void {
    const tick = (): void => {
      if (this.dave.state !== DaveState.STANDING) {
        let dX = 0;
        let dY = 0;
        if (this.dave.state === DaveState.RUNNING) {
          if (this.isDaveHasToFall()) {
            this.dave.state = DaveState.FALLING;
          } else {
            [dX, dY] = this.getHorizontalDiffMovingLeftRight();
          }
        } else if (this.dave.state === DaveState.FALLING) {
          [dX, dY] = this.getDiffFalling();
        } else if (this.dave.state === DaveState.JUMPING_UP) {
          [dX, dY] = this.getDiffJumping();
        } else if (this.dave.state === DaveState.JUMPING_DOWN) {
          [dX, dY] = this.getDiffStartJumpingDown();
        } else if (this.dave.state === DaveState.SHOOTING) {
          [dX, dY] = this.getDiffShooting();
        }

        this.dave.correctPosByDiff(
          dX,
          dY,
          this.gameView.levelAreaW,
          this.gameView.levelAreaH,
        );
        this.gameView.correctLevelPosition();
      } else if (this.isDaveHasToFall()) {
        this.dave.state = DaveState.FALLING;
      }
      this.dave.setView();
      this.dave.showShootLine(
        this.gameView.canvas,
        this.gameView.canvasData,
        this.calcEndOfLineShoot(),
      );
      requestAnimationFrame(tick);
    };
    tick();
  }

  isCrossWithWalls(rectCommon: Rect): Rect[] {
    const crossWalls: Rect[] = [];
    for (let i = 0; i < this.gameView.walls.length; i += 1) {
      if (
        rectCommon.x < this.gameView.walls[i].x + this.gameView.walls[i].w
        && rectCommon.x + rectCommon.w > this.gameView.walls[i].x
        && rectCommon.y < this.gameView.walls[i].y + this.gameView.walls[i].h
        && rectCommon.h + rectCommon.y > this.gameView.walls[i].y
      ) {
        crossWalls.push(this.gameView.walls[i]);
      }
    }
    return crossWalls;
  }

  isCrossWithPlatforms(rectCommon: Rect, rectStart: Rect): Rect[] {
    const crossPlatforms: Rect[] = [];
    for (let i = 0; i < this.gameView.platforms.length; i += 1) {
      if (
        rectCommon.x < this.gameView.platforms[i].x
        + this.gameView.platforms[i].w
        && rectCommon.x + rectCommon.w > this.gameView.platforms[i].x
        && rectCommon.y < this.gameView.platforms[i].y
        + this.gameView.platforms[i].h
        && rectCommon.h + rectCommon.y > this.gameView.platforms[i].y
        && rectStart.x < this.gameView.platforms[i].x
        + this.gameView.platforms[i].w
        && rectStart.x + rectStart.w > this.gameView.platforms[i].x
        && rectStart.y + rectStart.h <= this.gameView.platforms[i].y
      ) {
        crossPlatforms.push(this.gameView.platforms[i]);
      }
    }
    return crossPlatforms;
  }

  isDaveHasToFall(): boolean {
    const underWalls: Rect[] = this.isCrossWithWalls(
      {
        x: this.dave.x,
        y: this.dave.y + this.dave.h,
        w: this.dave.w,
        h: 1,
      },
    );
    const underPlatforms: Rect[] = this.isCrossWithPlatforms(
      {
        x: this.dave.x,
        y: this.dave.y + this.dave.h,
        w: this.dave.w,
        h: 1,
      },
      {
        x: this.dave.x,
        y: this.dave.y,
        w: this.dave.w,
        h: this.dave.h,
      },
    );
    if (underWalls.length === 0 && underPlatforms.length === 0) {
      return true;
    }
    return false;
  }

  setListener(): void {
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      switch (e.code) {
        case 'ArrowLeft':
          if (e.altKey) {
            e.preventDefault();
          }
          if (this.dave.state === DaveState.STANDING) {
            this.dave.state = DaveState.RUNNING;
          }
          if (this.dave.state !== DaveState.SHOOTING
            && this.dave.state !== DaveState.STUCK) {
            this.dave.move = DaveMove.LEFT;
            this.dave.look = DaveLook.LEFT;
          }
          break;
        case 'ArrowRight':
          if (e.altKey) {
            e.preventDefault();
          }
          if (this.dave.state === DaveState.STANDING) {
            this.dave.state = DaveState.RUNNING;
          }
          if (this.dave.state !== DaveState.SHOOTING
            && this.dave.state !== DaveState.STUCK) {
            this.dave.move = DaveMove.RIGHT;
            this.dave.look = DaveLook.RIGHT;
          }
          break;
        case 'ArrowUp':
          if (this.dave.state === DaveState.STANDING) {
            this.dave.shoot = DaveShoot.UP;
          }
          break;
        case 'ArrowDown':
          if (this.dave.state === DaveState.STANDING) {
            this.dave.shoot = DaveShoot.DOWN;
          }
          break;
        case 'Space':
          if (this.dave.state === DaveState.RUNNING
            || this.dave.state === DaveState.STANDING) {
            if (this.dave.shoot === DaveShoot.DOWN) {
              this.dave.state = DaveState.JUMPING_DOWN;
            } else {
              this.dave.state = DaveState.JUMPING_UP;
            }
            this.dave.velocity = this.dave.jumpStartVelocity;
          }
          break;
        case 'AltLeft':
          if (e.altKey) {
            e.preventDefault();
          }
          if (this.dave.state === DaveState.STANDING
            || this.dave.state === DaveState.RUNNING
            || this.dave.state === DaveState.RECHARGING) {
            this.dave.state = DaveState.SHOOTING;
            this.daveShoot();
            setTimeout(() => {
              this.dave.state = DaveState.STUCK;
              setTimeout(() => {
                this.dave.state = DaveState.STANDING;
              }, 200);
            }, 50);
          }
          break;
        default:
          this.dave.setView();
          break;
      }
    });
    window.addEventListener('keyup', (e: KeyboardEvent) => {
      if (e.code === 'ArrowRight' || e.code === 'ArrowLeft') {
        if (this.dave.state === DaveState.RUNNING) {
          this.dave.state = DaveState.STANDING;
        }
        this.dave.move = DaveMove.NONE;
      }
      if (e.code === 'ArrowUp') {
        this.dave.shoot = DaveShoot.CENTER;
      }
      if (e.code === 'ArrowDown') {
        this.dave.shoot = DaveShoot.CENTER;
      }
      this.dave.setView();
    });
  }

  animateZombies(): void {
    setInterval(() => {
      for (let i = 0; i < this.gameView.zombies.length; i += 1) {
        const item = this.gameView.zombies[i];
        let dX = 0;
        if (item.movingRight) {
          dX = item.stepSize;
        } else if (item.movingLeft) {
          dX = -item.stepSize;
        }
        if (this.isCrossWithWalls({
          x: item.x + ((dX < 0) ? dX : 0),
          y: item.y,
          w: item.w + ((dX > 0) ? dX : 0),
          h: item.h,
        }).length === 0) {
          item.x += dX;
        } else {
          item.swapMoving();
        }
        item.setPosition();
      }
    }, 300);
  }

  calcEndOfLineShoot(): Offset {
    let dX = 0;
    let dY = 0;
    const toLeft: number = this.dave.x
      + this.gameView.levelAreaX + this.dave.w / 2;
    const toRight: number = this.gameView.viewAreaW - toLeft;
    const toTop: number = this.dave.y
      + this.gameView.levelAreaY + this.dave.h / 2;
    const toBottom: number = this.gameView.viewAreaH - toTop;
    if (this.dave.look === DaveLook.LEFT) {
      dX = -toLeft;
      if (this.dave.shoot === DaveShoot.UP) {
        if (-toLeft < -toTop) {
          dX = -toTop;
          dY = -toTop;
        } else {
          dY = -toLeft;
        }
      } else if (this.dave.shoot === DaveShoot.DOWN) {
        if (toLeft > toBottom) {
          dX = -toBottom;
          dY = toBottom;
        } else {
          dY = toLeft;
        }
      } else {
        dY = 0;
      }
    } else if (this.dave.look === DaveLook.RIGHT) {
      dX = toRight;
      if (this.dave.shoot === DaveShoot.UP) {
        if (-toRight < -toTop) {
          dX = toTop;
          dY = -toTop;
        } else {
          dY = -toRight;
        }
      } else if (this.dave.shoot === DaveShoot.DOWN) {
        if (toRight > toBottom) {
          dX = toBottom;
          dY = toBottom;
        } else {
          dY = toRight;
        }
      } else {
        dY = 0;
      }
    }

    return [dX, dY];
  }

  daveShoot(): void {
    const fromX: number = this.dave.x + this.dave.w / 2;
    const fromY: number = this.dave.y + this.dave.h / 2;
    const [dX, dY] = this.calcEndOfLineShoot();
    let closestWall: Rect | undefined;
    this.gameView.walls.forEach((wall) => {
      if (this.isLineCrossRect({
        x1: fromX,
        y1: fromY,
        x2: fromX + dX,
        y2: fromY + dY,
      }, wall)) {
        if (!closestWall || this.isOneRectCloserAnother(wall, closestWall)) {
          closestWall = wall;
        }
      }
    });
    let closestMonster: Zombie | undefined;
    this.gameView.zombies.forEach((monster) => {
      if (this.isLineCrossRect({
        x1: fromX,
        y1: fromY,
        x2: fromX + dX,
        y2: fromY + dY,
      }, monster)) {
        if (!closestMonster
          || this.isOneRectCloserAnother(monster, closestMonster)) {
          closestMonster = monster;
        }
      }
    });
    if ((closestMonster && !closestWall)
      || (closestMonster
      && closestWall
      && this.isOneRectCloserAnother(closestMonster, closestWall))
    ) {
      closestMonster.getAttacked();
      if (closestMonster.health === 0) {
        this.gameView.removeZombie(closestMonster);
      }
    }
  }

  isOneRectCloserAnother(wall: Rect, monster: Rect): boolean {
    if (this.dave.look === DaveLook.RIGHT) {
      if (this.dave.shoot === DaveShoot.CENTER) {
        return (wall.x + wall.w < monster.x);
      } if (this.dave.shoot === DaveShoot.UP) {
        return !!((wall.x + wall.w <= monster.x
          || wall.y >= monster.y + monster.h));
      } if (this.dave.shoot === DaveShoot.DOWN) {
        return !!((wall.x + wall.w <= monster.x
          || wall.y + wall.h <= monster.y));
      }
    } else if (this.dave.look === DaveLook.LEFT) {
      if (this.dave.shoot === DaveShoot.CENTER) {
        return (wall.x >= monster.x + monster.w);
      } if (this.dave.shoot === DaveShoot.UP) {
        return !!((wall.x >= monster.x + monster.w
          || wall.y >= monster.y + monster.h));
      } if (this.dave.shoot === DaveShoot.DOWN) {
        return !!((wall.x >= monster.x + monster.w
          || wall.y + wall.h <= monster.y));
      }
    }
    return false;
  }

  isLineCrossLine(line1: Line, line2: Line): boolean {
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

  isLineCrossRect(line: Line, rect: Rect): boolean {
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
    if (left || right || top || bottom) {
      return true;
    }
    return false;
  }
}

export default PlayLevel;
