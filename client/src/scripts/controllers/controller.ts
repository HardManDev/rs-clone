import { Rect } from '../../types/types';
import Player from '../components/dave';
import GameView from '../components/game';

class Controller {
  gameView: GameView;

  dave: Player;

  constructor() {
    this.gameView = new GameView();
    this.gameView.loadWalls();
    this.gameView.loadPlatforms();
    this.gameView.loadZombies();
    this.dave = new Player();
    this.gameView.insertPlayer(this.dave);
    this.animate();
    this.setListener();
    this.animateZombies();
  }

  getHorizDiffMovingLeftRight(): number {
    let dX = 0;
    if (this.dave.movingRight) {
      dX = 10;
    } else if (this.dave.movingLeft) {
      dX = -10;
    }
    if (this.isCrossWithWalls({
      x: this.dave.x + ((dX < 0) ? dX : 0),
      y: this.dave.y,
      w: this.dave.w + ((dX > 0) ? dX : 0),
      h: this.dave.h,
    }).length === 0) {
      return dX;
    }
    return 0;
  }

  getDiffFalling(): [number, number] {
    let dX = 0;
    let dY = 0;
    dY = this.dave.velicity * 2 + 2;
    if (this.dave.movingRight) {
      dX = 10;
    } else if (this.dave.movingLeft) {
      dX = -10;
    }
    this.dave.velicity += 0.5;
    const walls: Rect[] = this.isCrossWithWalls({
      x: this.dave.x + ((dX < 0) ? dX : 0),
      y: this.dave.y + ((dY < 0) ? dY : 0),
      w: this.dave.w + ((dX > 0) ? dX : 0),
      h: this.dave.h + ((dY > 0) ? dY : 0),
    });
    const platform: Rect | null = this.isCrossWithPlatforms(
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
    if (platform) {
      walls.push(platform);
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
        this.dave.falling = false;
        this.dave.velicity = 0;
        if ((wallRight && dX > 0) || (wallLeft && dX < 0)) {
          dX = 0;
        }
      } else {
        dX = 0;
      }
    }
    return [dX, dY];
  }

  getDiffJumping(): [number, number] {
    let dX = 0;
    let dY = 0;
    dY = -this.dave.velicity * 2 - 2;
    if (this.dave.movingRight) {
      dX = 10;
    } else if (this.dave.movingLeft) {
      dX = -10;
    }

    this.dave.velicity -= 0.5;
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
        this.dave.falling = false;
        this.dave.velicity = 0;
        if ((wallRight && dX > 0) || (wallLeft && dX < 0)) {
          dX = 0;
        }
      } else {
        dX = 0;
      }
    }
    if (this.dave.velicity === 0) {
      this.dave.falling = true;
      this.dave.jumping = false;
    }
    return [dX, dY];
  }

  getDiffStartJumpingDown(): [number, number] {
    let dX = 0;
    let dY = 0;
    dY = this.dave.velicity * 2 + 2;
    if (this.dave.movingRight) {
      dX = 10;
    } else if (this.dave.movingLeft) {
      dX = -10;
    }
    this.dave.startJumpingDown = false;
    this.dave.velicity += 0.5;
    const walls: Rect[] = this.isCrossWithWalls({
      x: this.dave.x + ((dX < 0) ? dX : 0),
      y: this.dave.y + ((dY < 0) ? dY : 0),
      w: this.dave.w + ((dX > 0) ? dX : 0),
      h: this.dave.h + ((dY > 0) ? dY : 0),
    });
    if (walls.length === 0) {
      this.dave.falling = true;
    }
    return [dX, dY];
  }

  animate(): void {
    const tick = () => {
      if (!this.dave.stopped) {
        let dX = 0;
        let dY = 0;
        if (!this.dave.falling && !this.dave.jumping && !this.dave.startJumpingDown) {
          if (this.isDaveHasToFall()) {
            this.dave.falling = true;
          } else {
            dX = this.getHorizDiffMovingLeftRight();
          }
        } else if (this.dave.falling) {
          [dX, dY] = this.getDiffFalling();
        } else if (this.dave.jumping) {
          [dX, dY] = this.getDiffJumping();
        } else if (this.dave.startJumpingDown) {
          [dX, dY] = this.getDiffStartJumpingDown();
        }

        this.dave.correctPosByDiff(dX, dY, this.gameView.levelAreaW, this.gameView.levelAreaH);
        this.gameView.correctPlaygroundPosition({
          x: this.dave.x,
          y: this.dave.y,
          w: this.dave.w,
          h: this.dave.h,
        });
      } else if (this.isDaveHasToFall()) {
        this.dave.stopped = false;
        this.dave.falling = true;
      }
      this.dave.setView();
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

  isCrossWithPlatforms(rectCommon: Rect, rectStart: Rect): Rect | null {
    for (let i = 0; i < this.gameView.platforms.length; i += 1) {
      if (
        rectCommon.x < this.gameView.platforms[i].x + this.gameView.platforms[i].w
        && rectCommon.x + rectCommon.w > this.gameView.platforms[i].x
        && rectCommon.y < this.gameView.platforms[i].y + this.gameView.platforms[i].h
        && rectCommon.h + rectCommon.y > this.gameView.platforms[i].y
        && rectStart.x < this.gameView.platforms[i].x + this.gameView.platforms[i].w
        && rectStart.x + rectStart.w > this.gameView.platforms[i].x
        && rectStart.y + rectStart.h <= this.gameView.platforms[i].y
      ) {
        return this.gameView.platforms[i];
      }
    }
    return null;
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
    const underPlatforms: Rect | null = this.isCrossWithPlatforms(
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
    if (underWalls.length === 0 && underPlatforms === null) {
      return true;
    }
    return false;
  }

  setListener(): void {
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      this.dave.stopped = false;
      switch (e.code) {
        case 'ArrowLeft':
          this.dave.movingRight = false;
          this.dave.movingLeft = true;
          this.dave.lookingRight = false;
          this.dave.lookingLeft = true;
          break;
        case 'ArrowRight':
          this.dave.movingRight = true;
          this.dave.movingLeft = false;
          this.dave.lookingRight = true;
          this.dave.lookingLeft = false;
          break;
        case 'ArrowUp':
          if (!this.dave.falling && !this.dave.jumping) {
            this.dave.lookingDown = false;
            this.dave.lookingUp = true;
          }
          break;
        case 'ArrowDown':
          if (!this.dave.falling && !this.dave.jumping) {
            this.dave.lookingDown = true;
            this.dave.lookingUp = false;
          }
          break;
        case 'Space':
          if (!this.dave.falling && !this.dave.jumping) {
            if (this.dave.lookingDown) {
              this.dave.startJumpingDown = true;
            } else {
              this.dave.jumping = true;
            }
            this.dave.velicity = this.dave.jumpStartVelocity;
          }
          break;
        default:
          this.dave.setView();
          break;
      }
    });
    window.addEventListener('keyup', (e: KeyboardEvent) => {
      if (!this.dave.falling && !this.dave.jumping) {
        // this.dave.stopped = true;
      }
      if (e.code === 'ArrowRight') {
        this.dave.movingRight = false;
      }
      if (e.code === 'ArrowLeft') {
        this.dave.movingLeft = false;
      }
      if (e.code === 'ArrowUp') {
        this.dave.movingUp = false;
        if (!this.dave.falling && !this.dave.jumping) {
          this.dave.lookingUp = false;
        }
      }
      if (e.code === 'ArrowDown') {
        this.dave.movingDown = false;
        if (!this.dave.falling && !this.dave.jumping) {
          this.dave.lookingDown = false;
        }
      }
      this.dave.setView();
    });
  }

  animateZombies(): void {
    for (let i = 0; i < this.gameView.zombies.length; i += 1) {
      const item = this.gameView.zombies[i];
      setInterval(() => {
        console.log(1);
        let dX = 0;
        if (item.movingRight) {
          dX = 10;
        } else if (item.movingLeft) {
          dX = -10;
        }
        if (this.isCrossWithWalls({
          x: item.X + ((dX < 0) ? dX : 0),
          y: item.Y,
          w: item.W + ((dX > 0) ? dX : 0),
          h: item.H,
        }).length === 0) {
          item.X += dX;
        } else {
          item.swapMoving();
        }
        item.setPosition();
      }, 500);
    }
  }
}

export default Controller;
