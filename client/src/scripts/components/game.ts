import '@styles/level';

import { Rect, LevelEntity, LeftFeet } from '../../types/game';
import Player from './dave';
import Zombie from './zombie';
import { LEVEL1 } from '../../assets/levels/level1';
import Crone from './crone';

export type Monster = Zombie | Crone;

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

  playerAreaW = 128;

  playerAreaH = 256;

  tileSize = 48;

  walls: Rect[] = [];

  platforms: Rect[] = [];

  monsters: Monster[] = [];

  dave: Player;

  constructor() {
    this.levelArea.classList.add('level-area');
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
    document.querySelector('body')?.append(this.viewArea);
  }

  loadLevelEntities(): void {
    this.walls = this.loadBorders(LevelEntity.WALL);
    this.showWalls();
    this.platforms = this.loadBorders(LevelEntity.PLATFORM);
    this.showPlatforms();
    this.loadCharacters(LevelEntity.ZOMBIE).forEach((leftFeet) => {
      this.monsters.push(new Zombie(leftFeet, this.levelArea));
    });
    this.loadCharacters(LevelEntity.CRONE).forEach((leftFeet) => {
      this.monsters.push(new Crone(leftFeet, this.levelArea));
    });
    this.showMonsters();
    this.dave = new Player(this.loadCharacters(LevelEntity.DAVE)[0]);
    this.insertPlayer();
    this.correctLevelPosition();
    this.levelArea.classList.add('level1');
    console.log('asd');
  }

  loadBorders(entityType: LevelEntity): Rect[] {
    const entities: Rect[] = [];
    LEVEL1.split('\n').forEach((line, indx) => {
      const arrLine: string[] = line.split(' ');
      let bricksCount = 0;
      let brickPos = -1;
      for (let i = 0; i < arrLine.length; i += 1) {
        if (arrLine[i] === entityType) {
          if (bricksCount === 0) {
            brickPos = i;
          }
          bricksCount += 1;
          if (i === arrLine.length - 1) {
            entities.push({
              x: brickPos * this.tileSize,
              y: indx * this.tileSize,
              w: bricksCount * this.tileSize,
              h: entityType === LevelEntity.WALL ? this.tileSize : 1,
            });
            bricksCount = 0;
            brickPos = -1;
          }
        } else if (brickPos !== -1) {
          entities.push({
            x: brickPos * this.tileSize,
            y: indx * this.tileSize,
            w: bricksCount * this.tileSize,
            h: entityType === LevelEntity.WALL ? this.tileSize : 1,
          });
          bricksCount = 0;
          brickPos = -1;
        }
      }
    });
    return entities;
  }

  loadCharacters(entityType: LevelEntity): LeftFeet[] {
    const characters: LeftFeet[] = [];
    LEVEL1.split('\n').forEach((line, indx) => {
      const arrLine = line.split(' ');
      for (let i = 0; i < arrLine.length; i += 1) {
        if (arrLine[i] === entityType) {
          characters.push({
            x: i * this.tileSize,
            y: (indx + 1) * this.tileSize,
          });
        }
      }
    });
    return characters;
  }

  showWalls(): void {
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

  showPlatforms(): void {
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

  insertPlayer(): void {
    this.levelArea.append(this.dave.sprite);
  }

  showMonsters(): void {
    this.monsters.forEach((item) => {
      this.levelArea.append(item.sprite);
    });
  }

  correctLevelPosition(): void {
    const daveViewX = this.dave.x + this.levelAreaX;
    const rAreaX = this.viewAreaW / 2 + this.playerAreaW / 2 - this.dave.w;
    const lAreaX = this.viewAreaW / 2 - this.playerAreaW / 2;
    if (daveViewX > rAreaX) {
      this.levelAreaX = rAreaX - this.dave.x;
    }
    if (daveViewX < lAreaX) {
      this.levelAreaX = this.viewAreaW / 2
      - this.playerAreaW / 2 - this.dave.x;
    }
    if (this.levelAreaX > 0) this.levelAreaX = 0;
    if (
      this.levelAreaX < this.viewAreaW - this.levelAreaW) {
      this.levelAreaX = this.viewAreaW - this.levelAreaW;
    }

    const daveViewY = this.dave.y + this.levelAreaY;
    const tAreaY = this.viewAreaH / 2 - this.playerAreaH / 2;
    const bAreaY = this.viewAreaH / 2 + this.playerAreaH / 2 - this.dave.h;
    if (daveViewY > bAreaY) {
      this.levelAreaY = bAreaY - this.dave.y;
    }
    if (daveViewY < tAreaY) {
      this.levelAreaY = this.viewAreaH / 2
      - this.playerAreaH / 2 - this.dave.y;
    }
    if (this.levelAreaY > 0) this.levelAreaY = 0;
    if (this.levelAreaY < this.viewAreaH - this.levelAreaH) {
      this.levelAreaY = this.viewAreaH - this.levelAreaH;
    }
    this.levelArea.style.transform = `translate(${this.levelAreaX}px, ${this.levelAreaY}px)`;
  }

  removeZombie(monster: Monster): void {
    monster.removeSprite();
    this.monsters.splice(this.monsters.indexOf(monster), 1);
  }

  resetLevel(): void {
    this.walls = [];
    this.platforms = [];
    this.monsters = [];
    this.levelArea.innerHTML = '';
  }
}

export default GameView;
