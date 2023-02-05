import { Rect } from '../../types/types';
import Player from './dave';
import Zombie from './zombie';

class GameView {
  levelArea: HTMLElement = document.createElement('div');

  levelAreaX = 0;

  levelAreaY = 0;

  levelAreaW = 2880;

  levelAreaH = 1776;

  viewArea: HTMLElement = document.createElement('div');

  viewAreaW = 960;

  viewAreaH = 630;

  playerArea: HTMLElement = document.createElement('div');

  playerAreaW = 260;

  playerAreaH = 300;

  walls: Rect[] = [];

  platforms: Rect[] = [];

  zombies: Zombie[] = [];

  constructor() {
    this.levelArea.classList.add('playground-area');
    this.levelArea.style.width = `${this.levelAreaW}px`;
    this.levelArea.style.height = `${this.levelAreaH}px`;
    this.viewArea.classList.add('view-area');
    this.viewArea.style.width = `${this.viewAreaW}px`;
    this.viewArea.style.height = `${this.viewAreaH}px`;
    this.playerArea.classList.add('player-area');
    this.playerArea.style.width = `${this.playerAreaW}px`;
    this.playerArea.style.height = `${this.playerAreaH}px`;
    this.playerArea.style.left = `${this.viewAreaW / 2 - this.playerAreaW / 2}px`;
    this.playerArea.style.top = `${this.viewAreaH / 2 - this.playerAreaH / 2}px`;

    this.viewArea.append(this.levelArea, this.playerArea);
    document.querySelectorAll('.opacity_side')[0]?.after(this.viewArea);
  }

  loadWalls(): void {
    this.walls.push({
      x: 0, y: 600, w: 400, h: 10,
    });
    this.walls.push({
      x: 500, y: 200, w: 10, h: 500,
    });
    this.walls.push({
      x: 1900, y: 300, w: 10, h: 500,
    });
    this.walls.push({
      x: 200, y: 300, w: 1000, h: 10,
    });
    this.walls.push({
      x: 400, y: 800, w: 1000, h: 10,
    });
    this.walls.push({
      x: 1500, y: 1500, w: 1000, h: 10,
    });
    this.walls.push({
      x: 1000, y: 200, w: 10, h: 100,
    });

    this.walls.forEach((item) => {
      const elem: HTMLElement = document.createElement('div');
      elem.classList.add('wall');
      elem.style.width = `${item.w}px`;
      elem.style.height = `${item.h}px`;
      elem.style.left = `${item.x}px`;
      elem.style.top = `${item.y}px`;
      this.levelArea.append(elem);
    });
  }

  loadPlatforms(): void {
    this.platforms.push({
      x: 1000, y: 600, w: 200, h: 1,
    });
    this.platforms.push({
      x: 1200, y: 550, w: 200, h: 1,
    });
    this.platforms.push({
      x: 1400, y: 500, w: 200, h: 1,
    });
    this.platforms.push({
      x: 1600, y: 450, w: 200, h: 1,
    });
    this.platforms.push({
      x: 1800, y: 400, w: 200, h: 1,
    });
    this.platforms.forEach((item) => {
      const elem: HTMLElement = document.createElement('div');
      elem.classList.add('wall');
      elem.style.width = `${item.w}px`;
      elem.style.height = `${item.h}px`;
      elem.style.left = `${item.x}px`;
      elem.style.top = `${item.y}px`;
      this.levelArea.append(elem);
    });
  }

  insertPlayer(player: Player): void {
    this.levelArea.append(player.sprite);
  }

  loadZombies(): void {
    this.zombies.push(new Zombie(800, 100));
    this.zombies.forEach((item) => {
      this.levelArea.append(item.sprite);
    });
  }

  correctPlaygroundPosition(dave: Rect): void {
    const daveViewX = dave.x + this.levelAreaX;
    const rAreaX = this.viewAreaW / 2 + this.playerAreaW / 2 - dave.w;
    const lAreaX = this.viewAreaW / 2 - this.playerAreaW / 2;
    if (daveViewX > rAreaX) {
      this.levelAreaX = rAreaX - dave.x;
    }
    if (daveViewX < lAreaX) {
      this.levelAreaX = this.viewAreaW / 2
      - this.playerAreaW / 2 - dave.x;
    }
    if (this.levelAreaX > 0) this.levelAreaX = 0;
    if (
      this.levelAreaX < this.viewAreaW - this.levelAreaW) {
      this.levelAreaX = this.viewAreaW - this.levelAreaW;
    }

    const daveViewY = dave.y + this.levelAreaY;
    const tAreaY = this.viewAreaH / 2 - this.playerAreaH / 2;
    const bAreaY = this.viewAreaH / 2 + this.playerAreaH / 2 - dave.h;
    if (daveViewY > bAreaY) {
      this.levelAreaY = bAreaY - dave.y;
    }
    if (daveViewY < tAreaY) {
      this.levelAreaY = this.viewAreaH / 2
      - this.playerAreaH / 2 - dave.y;
    }
    if (this.levelAreaY > 0) this.levelAreaY = 0;
    if (
      this.levelAreaY < this.viewAreaH - this.levelAreaH) {
      this.levelAreaY = this.viewAreaH - this.levelAreaH;
    }
    this.levelArea.style.transform = `translate(${this.levelAreaX}px, ${this.levelAreaY}px)`;
  }
}

export default GameView;
