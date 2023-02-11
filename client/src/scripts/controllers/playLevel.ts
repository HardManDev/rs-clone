/* eslint-disable class-methods-use-this */
import {
  Line, Offset, Position, Rect,
} from '../../types/game';
import {
  DaveLook, DaveMove, DaveShoot, DaveState,
} from '../../types/dave';
import Player from '../components/dave';
import Zombie from '../components/zombie';
import GameView, { Monster } from '../components/game';
import {
  BulletMove, MonsterAttack, MonsterMove, MonsterState,
} from '../../types/monster';
import Crone from '../components/crone';

class PlayLevel {
  gameView: GameView;

  dave: Player;

  monsterAnimationTimer: number;

  daveAnimationTimer: number;

  constructor() {
    this.gameView = new GameView();
  }

  startGame(): void {
    this.gameView.loadLevelEntities();
    this.dave = this.gameView.dave;
    this.animate();
    this.setListener();
    this.animateMonsters();
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

  animate(fps = 60): void {
    const fpsInterval: number = 1000 / fps;
    let then: number = Date.now();
    const tick = (): void => {
      this.daveAnimationTimer = requestAnimationFrame(tick);

      const now: number = Date.now();
      const elapsed: number = now - then;
      if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);
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
        this.moveBullets();
        this.checkLoot();
      }
    };
    tick();
  }

  moveBullets(): void {
    this.gameView.monsters.forEach((monster) => {
      if (monster instanceof Crone) {
        monster.bullet.forEach((bullet) => {
          const dX = bullet.movedDir === BulletMove.LEFT
            ? -this.dave.stepSize
            : this.dave.stepSize;
          const dY = 0;
          const fullRect: Rect = {
            x: bullet.area.x + ((dX < 0) ? dX : 0),
            y: bullet.area.y,
            w: bullet.area.w + ((dX > 0) ? dX : 0),
            h: bullet.area.h,
          };
          if (!this.gameView.godMode && this.checkAttackDave(fullRect)) {
            this.daveGoesDead();
          }
          if (this.isCrossWithWalls(fullRect).length === 0) {
            (<Crone>monster).moveBullet(bullet, [dX, dY]);
          } else {
            (<Crone>monster).removeBullet(bullet);
          }
        });
      } else if (
        (monster instanceof Zombie)
        && !this.gameView.godMode
        && monster.bullet
        && this.checkAttackDave(monster.bullet.area)) {
        this.daveGoesDead();
      }
    });
  }

  daveGoesDead(): void {
    this.dave.state = DaveState.DEAD;
    this.gameView.lives -= 1;
    this.restartLevel();
  }

  checkLoot(): void {
    this.gameView.loot.forEach((loot) => {
      if (!loot.grabbed && this.isRectCrossWithRect(loot.area, this.dave)) {
        this.gameView.grabLoot(loot);
      }
    });
  }

  checkAttackDave(bullet: Rect): boolean {
    return !!this.isRectCrossWithRect(bullet, this.dave);
  }

  isRectCrossWithRect(rect1: Rect, rect2: Rect): boolean {
    return !!((rect1.x < rect2.x + rect2.w
        && rect1.x + rect1.w > rect2.x
        && rect1.y < rect2.y + rect2.h
        && rect1.h + rect1.y > rect2.y
    ));
  }

  isCrossWithWalls(rectCommon: Rect): Rect[] {
    const crossWalls: Rect[] = [];
    for (let i = 0; i < this.gameView.walls.length; i += 1) {
      if (this.isRectCrossWithRect(rectCommon, this.gameView.walls[i])) {
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
            let foundDoor = false;
            this.gameView.doors.forEach((door) => {
              if (!door.opened
                && this.isRectCrossWithRect(door.area, this.dave)) {
                this.gameView.openDoor(door);
                foundDoor = true;
              }
            });
            if (!foundDoor) {
              this.dave.shoot = DaveShoot.UP;
            }
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
        case 'KeyG':
          if (e.ctrlKey) {
            e.preventDefault();
            this.gameView.godMode = !this.gameView.godMode;
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

  animateMonsters(): void {
    this.monsterAnimationTimer = window.setInterval(() => {
      for (let i = 0; i < this.gameView.monsters.length; i += 1) {
        const monster = this.gameView.monsters[i];
        if (monster.state === MonsterState.MOVING) {
          this.moveMonster(monster);
        }
      }
    }, 50);
  }

  moveMonster(monster: Monster): void {
    if (monster.moveTicks === monster.moveTicksMax) {
      monster.moveTicks -= 1;
      let dX = 0;
      if (monster.moveDir === MonsterMove.RIGHT) {
        dX = monster.stepSize;
      } else if (monster.moveDir === MonsterMove.LEFT) {
        dX = -monster.stepSize;
      }
      if (this.isCrossWithWalls({
        x: monster.x + ((dX < 0) ? dX : 0),
        y: monster.y,
        w: monster.w + ((dX > 0) ? dX : 0),
        h: monster.h,
      }).length === 0) {
        const daveIsNear: Position = this.isDaveNearMonster(monster);
        const whereIsDave: Position = this.isDaveVisibleToMonster(monster);
        if (monster instanceof Crone) {
          const shootOrNot: boolean = Math.random() > 0.90;
          if (shootOrNot) {
            if (whereIsDave === Position.LEFT) {
              monster.state = MonsterState.ATTACKING;
              monster.attackDir = MonsterAttack.LEFT;
              (<Crone>monster).attack();
            } else if (whereIsDave === Position.RIGHT) {
              monster.state = MonsterState.ATTACKING;
              monster.attackDir = MonsterAttack.RIGHT;
              (<Crone>monster).attack();
            }
          }
        }
        if (daveIsNear === Position.NONE) {
          if (
            (whereIsDave === Position.LEFT
              && monster.moveDir === MonsterMove.RIGHT)
            || (whereIsDave === Position.RIGHT
              && monster.moveDir === MonsterMove.LEFT)
          ) {
            if (monster.randomSteps > 0) {
              monster.x += dX;
              monster.randomSteps -= 1;
            } else {
              monster.swapMoving();
              monster.setRandomSteps();
            }
          } else {
            monster.x += dX;
          }
        } else if (monster instanceof Zombie) {
          if (daveIsNear === Position.LEFT) {
            monster.state = MonsterState.ATTACKING;
            monster.attackDir = MonsterAttack.LEFT;
            (<Zombie>monster).attack();
          } else if (daveIsNear === Position.RIGHT) {
            monster.state = MonsterState.ATTACKING;
            monster.attackDir = MonsterAttack.RIGHT;
            (<Zombie>monster).attack();
          }
        }
      } else {
        monster.swapMoving();
      }
      monster.setPosition();
    } else if (monster.moveTicks === 0) {
      monster.moveTicks = monster.moveTicksMax;
    } else if (monster.moveTicks < monster.moveTicksMax) {
      monster.moveTicks -= 1;
    }
  }

  isDaveVisibleToMonster(monster: Monster): Position {
    const diffX: number = this.dave.x - monster.x;
    const diffY: number = this.dave.y - monster.y;
    if (Math.abs(diffX) > this.gameView.viewAreaW / 2
      || Math.abs(diffY) > this.gameView.viewAreaH / 4) {
      return Position.NONE;
    } if (diffX > 0) {
      return Position.RIGHT;
    }
    return Position.LEFT;
  }

  isDaveNearMonster(monster: Monster): Position {
    const diffX: number = this.dave.x - monster.x;
    const diffY: number = this.dave.y - monster.y;
    if (Math.abs(diffX) > this.dave.w
      || Math.abs(diffY) > Math.min(this.dave.h, monster.h)) {
      return Position.NONE;
    } if (diffX > 0) {
      return Position.RIGHT;
    }
    return Position.LEFT;
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
    const fromY: number = this.dave.y + this.dave.h / 2
      - this.dave.shootOffsetY;
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
    let closestMonster: Monster | undefined;
    this.gameView.monsters.forEach((monster) => {
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
        this.gameView.removeMonster(closestMonster);
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

  restartLevel(): void {
    clearInterval(this.monsterAnimationTimer);
    cancelAnimationFrame(this.daveAnimationTimer);
    if (this.gameView.lives > 0) {
      this.gameView.resetLevel();
      this.gameView.loadLevelEntities();
      this.dave = this.gameView.dave;
      this.animate();
      this.setListener();
      this.animateMonsters();
    } else {
      this.gameView.gameOver();
    }
  }
}

export default PlayLevel;
