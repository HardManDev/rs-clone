/* eslint-disable class-methods-use-this */
import {
  Barrier,
  Line, MoveAxis, Movement, ObjectState, Offset, Position, Rect, SoundType,
} from '../../types/game';
import {
  DaveLook, DaveMove, DaveShoot, DaveState,
} from '../../types/dave';
import Player from '../components/dave';
import Zombie from '../components/zombie';
import GameView, { Monster } from '../components/game';
import {
  BulletMove, Meat, MonsterAttack, MonsterMove, MonsterState,
} from '../../types/monster';
import Crone from '../components/crone';
import Geometry from './geometry';

class PlayLevel {
  gameView: GameView;

  dave: Player;

  monsterAnimationTimer: number;

  daveAnimationTimer: number;

  reloadAnimationTimer: number | undefined;

  reloadStartTimer: number | undefined;

  shootTimer: number | undefined;

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

  getXOffsetCorrected(offset: Offset): Offset {
    if (Geometry.getCrossWithWalls(
      this.gameView.walls,
      Geometry.getRectAfterOffset(this.dave, offset),
    ).length === 0) {
      return offset;
    }
    return [0, 0];
  }

  getIntersectRectsWhenFalling(offset: Offset): Rect[] {
    const walls: Rect[] = Geometry.getCrossWithWalls(
      this.gameView.walls,
      Geometry.getRectAfterOffset(this.dave, offset),
    );
    const platforms: Rect[] = Geometry.getCrossWithPlatforms(
      this.gameView.platforms,
      Geometry.getRectAfterOffset(this.dave, offset),
      this.dave,
    );
    if (platforms.length) {
      walls.push(...platforms);
    }
    return walls;
  }

  getBarriers(rect: Rect, offset: Offset, move: Movement): Barrier {
    const walls: Rect[] = Geometry.getCrossWithWalls(
      this.gameView.walls,
      Geometry.getRectAfterOffset(rect, offset),
    );
    if (move.y.velocity > 0) {
      const platforms: Rect[] = Geometry.getCrossWithPlatforms(
        this.gameView.platforms,
        Geometry.getRectAfterOffset(rect, offset),
        rect,
      );
      if (platforms.length) {
        walls.push(...platforms);
      }
    }
    const barrier: Barrier = {};
    for (let i = 0; i < walls.length; i += 1) {
      if (rect.x < walls[i].x + walls[i].w
      && rect.x + rect.w > walls[i].x
      && rect.y + rect.h <= walls[i].y) {
        barrier.below = walls[i];
      }
      if (rect.x < walls[i].x + walls[i].w
        && rect.x + rect.w > walls[i].x
        && rect.y >= walls[i].y + walls[i].h) {
        barrier.above = walls[i];
      }
      if (offset[0] > 0 && rect.x + offset[0] + rect.w >= walls[i].x) {
        barrier.right = walls[i];
      }
      if (offset[0] < 0 && rect.x + offset[0] <= walls[i].x + walls[i].w) {
        barrier.left = walls[i];
      }
    }
    return barrier;
  }

  getDiffShooting(): Offset {
    let dX = 0;
    if (this.dave.look === DaveLook.LEFT) {
      dX = this.dave.stepSize;
    } else if (this.dave.look === DaveLook.RIGHT) {
      dX = -this.dave.stepSize;
    }
    if (Geometry.getCrossWithWalls(
      this.gameView.walls,
      Geometry.getRectAfterOffset(this.dave, [dX, 0]),
    ).length === 0) {
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
        if (this.dave.state !== DaveState.STANDING
          && this.dave.state !== DaveState.RECHARGING) {
          this.resetReloadAnimation();
          const emptyMove: MoveAxis = { diff: 0, accel: false, velocity: 0 };
          const move: Movement = { x: emptyMove, y: emptyMove };
          if (this.dave.move === DaveMove.RIGHT) {
            move.x.diff = this.dave.stepSize;
          } else if (this.dave.move === DaveMove.LEFT) {
            move.x.diff = -this.dave.stepSize;
          }
          let dX = 0;
          let dY = 0;
          if (this.dave.state === DaveState.RUNNING) {
            if (this.isDaveHasToFall()) {
              this.dave.state = DaveState.FALLING;
            } else {
              [dX, dY] = this.getXOffsetCorrected(Geometry.getXOffset(move));
            }
          } else if (this.dave.state === DaveState.FALLING) {
            move.y.velocity = this.dave.velocity;
            move.y.accel = true;

            [dX, dY] = Geometry.getXYOffset(move);
            const barrier: Barrier = this.getBarriers(
              this.dave,
              [dX, dY],
              move,
            );
            if (barrier.below) {
              this.gameView.sounds[SoundType.LAND].play();
              dY = barrier.below.y - this.dave.h - this.dave.y;
              this.dave.state = this.dave.move === DaveMove.NONE
                ? DaveState.STANDING
                : DaveState.RUNNING;
              this.dave.velocity = 0;
              if ((barrier.right && dX > 0) || (barrier.left && dX < 0)) {
                dX = 0;
              }
            } else if (barrier.left || barrier.right) {
              dX = 0;
            }
            this.dave.velocity += 0.5;
          } else if (this.dave.state === DaveState.JUMPING_UP) {
            move.y.velocity = -this.dave.velocity;
            move.y.accel = true;
            [dX, dY] = Geometry.getXYOffset(move);
            this.dave.velocity -= 0.5;
            const barrier: Barrier = this.getBarriers(
              this.dave,
              [dX, dY],
              move,
            );
            if (barrier.above) {
              dY = barrier.above.y + barrier.above.h - this.dave.y;
              this.dave.state = DaveState.FALLING;
              this.dave.velocity = 0;
              if ((barrier.right && dX > 0) || (barrier.left && dX < 0)) {
                dX = 0;
              }
            } else if (barrier.left || barrier.right) {
              dX = 0;
            }
            if (this.dave.velocity === 0) {
              this.dave.state = DaveState.FALLING;
            }
          } else if (this.dave.state === DaveState.JUMPING_DOWN) {
            move.y.velocity = this.dave.velocity;
            move.y.accel = true;
            [dX, dY] = Geometry.getXYOffset(move);

            this.dave.velocity += 0.5;
            const walls: Rect[] = Geometry.getCrossWithWalls(
              this.gameView.walls,
              Geometry.getRectAfterOffset(this.dave, [dX, dY]),
            );
            if (walls.length === 0) {
              this.dave.state = DaveState.FALLING;
            } else {
              dY = 0;
              this.dave.state = DaveState.STANDING;
            }
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
        } else if (this.dave.state === DaveState.STANDING) {
          if (!this.reloadStartTimer
              && this.dave.bullets < this.dave.bulletsMax) {
            this.reloadStart();
          }
          if (this.dave.bullets === this.dave.bulletsMax) {
            this.resetReloadAnimation();
          }
        } else if (this.dave.state === DaveState.RECHARGING) {
          if (this.dave.bullets === this.dave.bulletsMax) {
            this.dave.state = DaveState.STANDING;
            this.resetReloadAnimation();
          }
        }
        this.dave.setView();
        this.moveMonsterBullets();
        this.moveMeat();
        this.checkLoot();
      }
    };
    tick();
  }

  moveMonsterBullets(): void {
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
          if (Geometry.getCrossWithWalls(
            this.gameView.walls,
            fullRect,
          ).length === 0) {
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

  moveMeat(): void {
    this.gameView.meat.forEach((meatPart) => {
      let dX = 0;
      let dY = 0;
      const emptyMove: MoveAxis = { diff: 0, accel: false, velocity: 0 };
      const move: Movement = { x: emptyMove, y: emptyMove };
      move.x.diff = meatPart.dX;
      if (meatPart.state !== ObjectState.STANDING) {
        if (meatPart.state === ObjectState.JUMPING_UP) {
          move.y.velocity = -meatPart.velocity;
          move.y.accel = true;
          [dX, dY] = Geometry.getXYOffset(move);
          meatPart.velocity -= 0.5;
          const bar: Barrier = this.getBarriers(meatPart.area, [dX, dY], move);
          [dX, dY] = this.getXYBArrier(meatPart.area, bar, [dX, dY]);
          if (bar.above) {
            meatPart.state = ObjectState.FALLING;
            meatPart.velocity = 0;
          }
          if (meatPart.velocity === 0) {
            meatPart.state = ObjectState.FALLING;
          }
        } else if (meatPart.state === ObjectState.FALLING) {
          move.y.velocity = meatPart.velocity;
          move.y.accel = true;

          [dX, dY] = Geometry.getXYOffset(move);
          const bar: Barrier = this.getBarriers(meatPart.area, [dX, dY], move);
          [dX, dY] = this.getXYBArrier(meatPart.area, bar, [dX, dY]);
          if (bar.below) {
            meatPart.state = ObjectState.STANDING;
            meatPart.velocity = 0;
          }
          meatPart.velocity += 0.5;
        }
        this.gameView.moveMeatPart(meatPart, [dX, dY]);
      } else {
        this.setMeatAnimation(meatPart);
      }
    });
  }

  setMeatAnimation(meatPart: Meat): void {
    if (!meatPart.animationTimer) {
      meatPart.animationTimer = window.setTimeout(() => {
        this.gameView.removeMeatPart(meatPart);
        clearTimeout(meatPart.animationTimer);
      }, 1000 + Math.round(Math.random() * 500));
    }
  }

  getXYBArrier(area: Rect, barrier: Barrier, offset: Offset): Offset {
    let dX = offset[0];
    let dY = offset[1];
    if (barrier.above) {
      dY = barrier.above.y + barrier.above.h - area.y;
      if ((barrier.right && dX > 0) || (barrier.left && dX < 0)) {
        dX = 0;
      }
    } else if (barrier.below) {
      dY = barrier.below.y - area.h - area.y;
      if ((barrier.right && dX > 0) || (barrier.left && dX < 0)) {
        dX = 0;
      }
    } else if (barrier.left || barrier.right) {
      dX = 0;
    }
    return [dX, dY];
  }

  daveGoesDead(): void {
    this.dave.showDeathLayer();
    this.dave.state = DaveState.DEAD;
    this.gameView.lives -= 1;
    this.stopGame();
    this.gameView.updateScoreOnScreen();
    setTimeout(() => {
      this.restartLevel();
    }, 3000);
  }

  checkLoot(): void {
    this.gameView.loot.forEach((loot) => {
      if (!loot.grabbed && Geometry.isRectCrossWithRect(loot.area, this.dave)) {
        this.gameView.grabLoot(loot);
        this.gameView.sounds[SoundType.BONUS1].play();
      }
    });
  }

  checkAttackDave(bullet: Rect): boolean {
    return !!Geometry.isRectCrossWithRect(bullet, this.dave);
  }

  isDaveHasToFall(): boolean {
    const daveRect: Rect = {
      x: this.dave.x,
      y: this.dave.y + this.dave.h,
      w: this.dave.w,
      h: 1,
    };
    const underWalls: Rect[] = Geometry.getCrossWithWalls(
      this.gameView.walls,
      daveRect,
    );
    const underPlatforms: Rect[] = Geometry.getCrossWithPlatforms(
      this.gameView.platforms,
      daveRect,
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
    window.onkeydown = (e: KeyboardEvent): void => {
      this.keyDownEvents(e);
    };
    window.onkeyup = (e: KeyboardEvent): void => {
      this.keyUpEvents(e);
    };
  }

  tryRun(): void {
    if (this.dave.state === DaveState.STANDING
      || this.dave.state === DaveState.RECHARGING) {
      this.dave.state = DaveState.RUNNING;
    }
  }

  tryMoveLeft(): void {
    if (this.dave.state !== DaveState.SHOOTING
      && this.dave.state !== DaveState.STUCK) {
      this.dave.move = DaveMove.LEFT;
      this.dave.look = DaveLook.LEFT;
    }
  }

  tryMoveRight(): void {
    if (this.dave.state !== DaveState.SHOOTING
      && this.dave.state !== DaveState.STUCK) {
      this.dave.move = DaveMove.RIGHT;
      this.dave.look = DaveLook.RIGHT;
    }
  }

  tryHandsUp(): void {
    if (this.dave.state === DaveState.STANDING
      || this.dave.state === DaveState.RECHARGING) {
      let foundDoor = false;
      this.gameView.doors.forEach((door) => {
        if (!door.opened
          && Geometry.isRectCrossWithRect(door.area, this.dave)) {
          this.gameView.openDoor(door);
          foundDoor = true;
        }
      });
      if (!foundDoor) {
        this.dave.shoot = DaveShoot.UP;
      }
    }
  }

  tryHandsDown(): void {
    if (this.dave.state === DaveState.STANDING
      || this.dave.state === DaveState.RECHARGING) {
      this.dave.shoot = DaveShoot.DOWN;
    }
  }

  tryJumpUpOrDown(): void {
    if (this.dave.state === DaveState.RUNNING
      || this.dave.state === DaveState.STANDING
      || this.dave.state === DaveState.RECHARGING) {
      if (this.dave.shoot === DaveShoot.DOWN) {
        this.dave.state = DaveState.JUMPING_DOWN;
      } else {
        this.dave.state = DaveState.JUMPING_UP;
        this.gameView.sounds[SoundType.JUMP].play();
      }
      this.dave.velocity = this.dave.jumpStartVelocity;
    }
  }

  tryHandsCenter(): void {
    this.dave.shoot = DaveShoot.CENTER;
  }

  tryStand(): void {
    if (this.dave.state === DaveState.RUNNING) {
      this.dave.state = DaveState.STANDING;
    }
    this.dave.move = DaveMove.NONE;
  }

  preventAlt(e: KeyboardEvent): void {
    if (e.altKey) {
      e.preventDefault();
    }
  }

  keyDownEvents(e: KeyboardEvent): void {
    switch (e.code) {
      case 'ArrowLeft':
        this.preventAlt(e);
        this.tryRun();
        this.tryMoveLeft();
        break;
      case 'ArrowRight':
        this.preventAlt(e);
        this.tryRun();
        this.tryMoveRight();
        break;
      case 'ArrowUp':
        this.tryHandsUp();
        break;
      case 'ArrowDown':
        this.tryHandsDown();
        break;
      case 'Space':
        this.tryJumpUpOrDown();
        break;
      case 'AltLeft':
        this.preventAlt(e);
        this.tryShoot();
        break;
      case 'KeyG':
        if (e.ctrlKey) {
          e.preventDefault();
          this.gameView.godMode = !this.gameView.godMode;
        }
        break;
      default:
        break;
    }
  }

  keyUpEvents(e: KeyboardEvent): void {
    if (e.code === 'ArrowRight' || e.code === 'ArrowLeft') {
      this.tryStand();
    }
    if (e.code === 'ArrowUp' || e.code === 'ArrowDown') {
      this.tryHandsCenter();
    }
  }

  animateMonsters(): void {
    this.monsterAnimationTimer = window.setInterval(() => {
      for (let i = 0; i < this.gameView.monsters.length; i += 1) {
        const monster = this.gameView.monsters[i];
        if (monster.state === MonsterState.MOVING) {
          this.moveMonster(monster);
          monster.setView();
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
      if (Geometry.getCrossWithWalls(
        this.gameView.walls,
        {
          x: monster.x + ((dX < 0) ? dX : 0),
          y: monster.y,
          w: monster.w + ((dX > 0) ? dX : 0),
          h: monster.h,
        },
      ).length === 0) {
        const daveIsNear: Position = this.isDaveNearMonster(monster);
        const whereIsDave: Position = this.isDaveVisibleToMonster(monster);
        if (monster instanceof Crone) {
          this.croneAttack(monster, whereIsDave);
        }
        if (daveIsNear === Position.NONE) {
          this.monsterRandomMove(monster, whereIsDave, dX);
        } else if (monster instanceof Zombie) {
          this.zombieAttack(monster, whereIsDave);
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

  croneAttack(crone: Monster, davePos: Position): void {
    const shootOrNot: boolean = Math.random() > 0.90;
    if (shootOrNot) {
      if (davePos === Position.LEFT) {
        crone.attackDir = MonsterAttack.LEFT;
      } else if (davePos === Position.RIGHT) {
        crone.attackDir = MonsterAttack.RIGHT;
      }
      crone.state = MonsterState.ATTACKING;
      (<Crone>crone).attack();
    }
  }

  zombieAttack(zombie: Monster, davePos: Position): void {
    if (davePos === Position.LEFT) {
      zombie.attackDir = MonsterAttack.LEFT;
    } else if (davePos === Position.RIGHT) {
      zombie.attackDir = MonsterAttack.RIGHT;
    }
    zombie.state = MonsterState.ATTACKING;
    (<Zombie>zombie).attack();
  }

  monsterRandomMove(monster: Monster, davePos: Position, dX: number): void {
    if (
      (davePos === Position.LEFT
        && monster.moveDir === MonsterMove.RIGHT)
      || (davePos === Position.RIGHT
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
      if (this.dave.shoot === DaveShoot.UP) {
        [dX, dY] = -toLeft < -toTop ? [-toTop, -toTop] : [-toLeft, -toLeft];
      } else if (this.dave.shoot === DaveShoot.DOWN) {
        [dX, dY] = toLeft > toBottom
          ? [-toBottom, toBottom]
          : [-toLeft, toLeft];
      } else {
        [dX, dY] = [-toLeft, 0];
      }
    } else if (this.dave.look === DaveLook.RIGHT) {
      if (this.dave.shoot === DaveShoot.UP) {
        [dX, dY] = -toRight < -toTop ? [toTop, -toTop] : [toRight, -toRight];
      } else if (this.dave.shoot === DaveShoot.DOWN) {
        [dX, dY] = toRight > toBottom
          ? [toBottom, toBottom]
          : [toRight, toRight];
      } else {
        [dX, dY] = [toRight, 0];
      }
    }

    return [dX, dY];
  }

  tryShoot(): void {
    if (this.dave.state === DaveState.STANDING
      || this.dave.state === DaveState.RUNNING
      || this.dave.state === DaveState.RECHARGING
      || this.dave.state === DaveState.SHOOTING
    ) {
      this.dave.state = DaveState.SHOOTING;
      if (this.dave.bullets > 0) {
        this.dave.bullets -= 1;
        this.gameView.showAmmo();
        this.gameView.sounds[SoundType.SHOT].currentTime = 0;
        this.gameView.sounds[SoundType.SHOT].play();
        this.checkDaveShoot();
      } else {
        this.gameView.sounds[SoundType.EMPTY].currentTime = 0;
        this.gameView.sounds[SoundType.EMPTY].play();
      }
      this.setDaveStuck();
    }
  }

  checkDaveShoot(): void {
    const x: number = this.dave.x + this.dave.w / 2;
    const y: number = this.dave.y + this.dave.h / 2
      - this.dave.shootOffsetY;
    const [dX, dY] = this.calcEndOfLineShoot();
    const shootLine = {
      x1: x, y1: y, x2: x + dX, y2: y + dY,
    };
    const closestWall: Rect | Monster | undefined = this.getClosestObj(
      shootLine,
      this.gameView.walls,
    );
    const closestMonster: Rect | Monster | undefined = this.getClosestObj(
      shootLine,
      this.gameView.monsters,
    );
    if ((closestMonster && !closestWall)
      || (closestMonster
      && closestWall
      && this.isFirstRectCloserToDave(closestMonster, closestWall))
    ) {
      (<Monster>closestMonster).getAttacked();
      if ((<Monster>closestMonster).health === 0) {
        this.gameView.createMeatExplosion(closestMonster);
        this.gameView.removeMonster((<Monster>closestMonster));
      }
    }
  }

  getClosestObj(shootLine: Line, rects: Rect[]): Rect | Monster | undefined {
    let result: Rect | Monster | undefined;
    rects.forEach((rect) => {
      if (Geometry.isLineCrossRect(shootLine, rect)) {
        if (!result
          || this.isFirstRectCloserToDave(rect, result)) {
          result = rect;
        }
      }
    });
    return result;
  }

  setDaveStuck(): void {
    setTimeout(() => {
      this.dave.state = DaveState.STUCK;
      if (!this.shootTimer) {
        this.shootTimer = window.setTimeout(() => {
          this.dave.state = DaveState.STANDING;
          this.shootTimer = undefined;
        }, 200);
      }
    }, 50);
  }

  isFirstRectCloserToDave(rect1: Rect, rect2: Rect): boolean {
    if (this.dave.look === DaveLook.RIGHT) {
      if (this.dave.shoot === DaveShoot.CENTER) {
        return (rect1.x + rect1.w < rect2.x);
      } if (this.dave.shoot === DaveShoot.UP) {
        return !!((rect1.x + rect1.w <= rect2.x
          || rect1.y >= rect2.y + rect2.h));
      } if (this.dave.shoot === DaveShoot.DOWN) {
        return !!((rect1.x + rect1.w <= rect2.x
          || rect1.y + rect1.h <= rect2.y));
      }
    } else if (this.dave.look === DaveLook.LEFT) {
      if (this.dave.shoot === DaveShoot.CENTER) {
        return (rect1.x >= rect2.x + rect2.w);
      } if (this.dave.shoot === DaveShoot.UP) {
        return !!((rect1.x >= rect2.x + rect2.w
          || rect1.y >= rect2.y + rect2.h));
      } if (this.dave.shoot === DaveShoot.DOWN) {
        return !!((rect1.x >= rect2.x + rect2.w
          || rect1.y + rect1.h <= rect2.y));
      }
    }
    return false;
  }

  stopGame(): void {
    clearInterval(this.monsterAnimationTimer);
    cancelAnimationFrame(this.daveAnimationTimer);
    this.resetReloadAnimation();
  }

  restartLevel(): void {
    if (this.gameView.lives > 0) {
      this.resetListeners();
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

  resetListeners(): void {
    window.onkeydown = null;
    window.onkeyup = null;
  }

  reloadStart(): void {
    this.reloadStartTimer = window.setTimeout(() => {
      this.reloadBullets();
      this.dave.state = DaveState.RECHARGING;
    }, 500);
  }

  reloadBullets(): void {
    this.reloadAnimationTimer = window.setInterval(() => {
      this.plusBullet();
    }, 700);
  }

  plusBullet(): void {
    this.dave.bullets += 1;
    this.gameView.showAmmo();
    this.gameView.sounds[SoundType.RELOAD].play();
  }

  resetReloadAnimation(): void {
    if (this.reloadAnimationTimer) {
      clearInterval(this.reloadAnimationTimer);
      this.reloadAnimationTimer = undefined;
    }
    if (this.reloadStartTimer) {
      clearTimeout(this.reloadStartTimer);
      this.reloadStartTimer = undefined;
    }
  }
}

export default PlayLevel;
