/* eslint-disable class-methods-use-this */
import {
  Line, ObjectState, Offset, Position, Rect, SoundType,
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
import Direction from '../../types/enums/directions';

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
        this.gameView.sounds[SoundType.LAND].play();
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
        if (this.dave.state !== DaveState.STANDING
          && this.dave.state !== DaveState.RECHARGING) {
          this.resetReloadAnimation();
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

  moveMeat(): void {
    this.gameView.meat.forEach((meatPart) => {
      let dX = 0;
      let dY = 0;
      if (meatPart.state !== ObjectState.STANDING) {
        if (meatPart.state === ObjectState.JUMPING_UP) {
          [dX, dY] = this.getDiffMeatJumping(meatPart);
        } else if (meatPart.state === ObjectState.FALLING) {
          [dX, dY] = this.getDiffMeatFalling(meatPart);
        }
        this.gameView.moveMeatPart(meatPart, [dX, dY]);
      } else if (!meatPart.animationTimer) {
        meatPart.animationTimer = window.setTimeout(() => {
          this.gameView.removeMeatPart(meatPart);
          clearTimeout(meatPart.animationTimer);
        }, 1000 + Math.round(Math.random() * 500));
      }
    });
  }

  getDiffMeatJumping(obj: Meat): Offset {
    let dX = 0;
    let dY = 0;
    dY = -obj.velocity * 2 - 2;
    if (obj.movedDir === Direction.RIGHT) {
      dX = obj.dX;
    } else if (obj.movedDir === Direction.LEFT) {
      dX = -obj.dX;
    }

    obj.velocity -= 0.5;
    const walls: Rect[] = this.isCrossWithWalls({
      x: obj.area.x + ((dX < 0) ? dX : 0),
      y: obj.area.y + ((dY < 0) ? dY : 0),
      w: obj.area.w + ((dX > 0) ? dX : 0),
      h: obj.area.h + ((dY > 0) ? dY : 0),
    });
    if (walls.length !== 0) {
      let wallAbove: Rect | null = null;
      let wallLeft: Rect | null = null;
      let wallRight: Rect | null = null;
      for (let i = 0; i < walls.length; i += 1) {
        if (obj.area.x < walls[i].x + walls[i].w
          && obj.area.x + obj.area.w > walls[i].x
          && obj.area.y >= walls[i].y + walls[i].h) {
          wallAbove = walls[i];
        }
        if (dX > 0 && obj.area.x + dX + obj.area.w >= walls[i].x) {
          wallRight = walls[i];
        }
        if (dX < 0 && obj.area.x + dX <= walls[i].x + walls[i].w) {
          wallLeft = walls[i];
        }
      }
      if (wallAbove) {
        dY = wallAbove.y + wallAbove.h - obj.area.y;
        obj.state = ObjectState.FALLING;
        obj.velocity = 0;
        if ((wallRight && dX > 0) || (wallLeft && dX < 0)) {
          dX = 0;
        }
      } else {
        dX = 0;
      }
    }
    if (obj.velocity === 0) {
      obj.state = ObjectState.FALLING;
    }
    return [dX, dY];
  }

  getDiffMeatFalling(obj: Meat): Offset {
    let dX = 0;
    let dY = 0;
    dY = obj.velocity * 2 + 2;
    if (obj.movedDir === Direction.RIGHT) {
      dX = obj.dX;
    } else if (obj.movedDir === Direction.LEFT) {
      dX = -obj.dX;
    }
    obj.velocity += 0.5;
    const walls: Rect[] = this.isCrossWithWalls({
      x: obj.area.x + ((dX < 0) ? dX : 0),
      y: obj.area.y + ((dY < 0) ? dY : 0),
      w: obj.area.w + ((dX > 0) ? dX : 0),
      h: obj.area.h + ((dY > 0) ? dY : 0),
    });
    const platforms: Rect[] = this.isCrossWithPlatforms(
      {
        x: obj.area.x + ((dX < 0) ? dX : 0),
        y: obj.area.y + ((dY < 0) ? dY : 0),
        w: obj.area.w + ((dX > 0) ? dX : 0),
        h: obj.area.h + ((dY > 0) ? dY : 0),
      },
      {
        x: obj.area.x,
        y: obj.area.w,
        w: obj.area.y,
        h: obj.area.h,
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
        if (obj.area.x < walls[i].x + walls[i].w
        && obj.area.x + obj.area.w > walls[i].x
        && obj.area.y + obj.area.h <= walls[i].y) {
          wallUnder = walls[i];
        }
        if (dX > 0 && obj.area.x + dX + obj.area.w >= walls[i].x) {
          wallRight = walls[i];
        }
        if (dX < 0 && obj.area.x + dX <= walls[i].x + walls[i].w) {
          wallLeft = walls[i];
        }
      }
      if (wallUnder) {
        this.gameView.sounds[SoundType.LAND].play();
        dY = wallUnder.y - obj.area.h - obj.area.y;
        obj.state = ObjectState.STANDING;
        obj.velocity = 0;
        if ((wallRight && dX > 0) || (wallLeft && dX < 0)) {
          dX = 0;
        }
      } else {
        dX = 0;
      }
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
      if (!loot.grabbed && this.isRectCrossWithRect(loot.area, this.dave)) {
        this.gameView.grabLoot(loot);
        this.gameView.sounds[SoundType.BONUS1].play();
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
          && this.isRectCrossWithRect(door.area, this.dave)) {
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
      } else {
        this.gameView.sounds[SoundType.EMPTY].currentTime = 0;
        this.gameView.sounds[SoundType.EMPTY].play();
      }
      this.setDaveStuck();
    }
  }

  getClosestObj(shootLine: Line, rects: Rect[]): Rect | Monster | undefined {
    let result: Rect | Monster | undefined;
    rects.forEach((rect) => {
      if (this.isLineCrossRect(shootLine, rect)) {
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
