/* eslint-disable class-methods-use-this */
import '@styles/level';
import jumpSound from '../../assets/sounds/jump.mp3';
import landSound from '../../assets/sounds/land.mp3';
import shotSound from '../../assets/sounds/shot.mp3';
import bonus1Sound from '../../assets/sounds/bonus1.mp3';
import emptySound from '../../assets/sounds/empty.mp3';
import reloadSound from '../../assets/sounds/reload.mp3';

import {
  Rect, LevelEntity, LeftFeet, Door, DoorSize,
  LootSize, Loot, SoundType, AllSound, Offset, ObjectState,
} from '../../types/game';
import Player from './dave';
import Zombie from './zombie';
import { LEVEL1 } from '../../assets/levels/level1';
import Crone from './crone';
import { Meat } from '../../types/monster';
import Direction from '../../types/enums/directions';

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

  playerAreaW = 128;

  playerAreaH = 256;

  tileSize = 48;

  walls: Rect[] = [];

  platforms: Rect[] = [];

  monsters: Monster[] = [];

  doors: Door[] = [];

  dave: Player;

  loot: Loot[] = [];

  godMode = false;

  score = 0;

  lives = 3;

  scoreElement: HTMLElement;

  sounds: AllSound = {};

  ammoElement: HTMLElement;

  meat: Meat[] = [];

  meatSizeX = 48;

  meatSizeY = 48;

  constructor() {
    this.levelArea.classList.add('level-area');
    this.levelArea.style.width = `${this.levelAreaW}px`;
    this.levelArea.style.height = `${this.levelAreaH}px`;
    this.viewArea.classList.add('view-area');
    this.viewArea.style.width = `${this.viewAreaW}px`;
    this.viewArea.style.height = `${this.viewAreaH}px`;
    this.scoreElement = document.createElement('div');
    this.scoreElement.classList.add('score');
    this.ammoElement = document.createElement('div');
    this.ammoElement.classList.add('ammo');
    this.viewArea.append(this.levelArea, this.scoreElement, this.ammoElement);
    document.querySelector('body')?.append(this.viewArea);
    this.sounds[SoundType.JUMP] = new Audio(jumpSound);
    this.sounds[SoundType.LAND] = new Audio(landSound);
    this.sounds[SoundType.SHOT] = new Audio(shotSound);
    this.sounds[SoundType.BONUS1] = new Audio(bonus1Sound);
    this.sounds[SoundType.EMPTY] = new Audio(emptySound);
    this.sounds[SoundType.RELOAD] = new Audio(reloadSound);
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
    this.loadDoors(LevelEntity.DOOR1);
    this.loadDoors(LevelEntity.DOOR2);
    this.loadDoors(LevelEntity.DOOR4);
    this.dave = new Player(this.loadCharacters(LevelEntity.DAVE)[0]);
    this.insertPlayer();
    this.showAmmo();
    this.correctLevelPosition();
    this.levelArea.classList.add('level1');
    this.updateScoreOnScreen();
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

  loadDoors(entityType: LevelEntity): void {
    LEVEL1.split('\n').forEach((line, indx) => {
      const arrLine = line.split(' ');
      for (let i = 0; i < arrLine.length; i += 1) {
        if (arrLine[i] === entityType) {
          const loot = {
            area: {
              x: i * this.tileSize + DoorSize.W / 2,
              y: (indx + 1) * this.tileSize - DoorSize.H + 10,
              w: LootSize.W,
              h: LootSize.H,
            },
            sprite: document.createElement('div'),
            grabbed: false,
            bonus: parseInt(entityType, 10) * 100,
          };
          const door: Door = {
            area: {
              x: i * this.tileSize,
              y: (indx + 1) * this.tileSize - DoorSize.H,
              w: DoorSize.W,
              h: DoorSize.H,
            },
            sprite: document.createElement('div'),
            loot,
            opened: false,
          };
          this.doors.push(door);
        }
      }
    });
    this.showClosedDoors();
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

  showClosedDoors(): void {
    this.doors.forEach((door) => {
      door.sprite.classList.add('door');
      door.sprite.style.width = `${door.area.w}px`;
      door.sprite.style.height = `${door.area.h}px`;
      door.sprite.style.left = `${door.area.x}px`;
      door.sprite.style.top = `${door.area.y}px`;
      door.loot.sprite.classList.add('loot');
      door.loot.sprite.classList.add(`loot${door.loot.bonus}`);
      door.loot.sprite.style.width = `${door.loot.area.w}px`;
      door.loot.sprite.style.height = `${door.loot.area.h}px`;
      door.loot.sprite.style.left = `${door.loot.area.x}px`;
      door.loot.sprite.style.top = `${door.loot.area.y}px`;
    });
  }

  openDoor(door: Door): void {
    door.opened = true;
    this.levelArea.append(door.sprite);
    this.levelArea.append(door.loot.sprite);
    this.loot.push(door.loot);
  }

  grabLoot(loot: Loot): void {
    loot.grabbed = true;
    this.score += loot.bonus;
    this.updateScoreOnScreen();
    loot.sprite.classList.remove(`loot${loot.bonus}`);
    loot.sprite.innerHTML = `${loot.bonus}`;
    setTimeout(() => {
      loot.sprite.remove();
      this.loot.splice(this.loot.indexOf(loot), 1);
    }, 2000);
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

  removeMonster(monster: Monster): void {
    monster.removeAllBullets();
    monster.removeSprite();
    this.score += monster.bonus;
    this.updateScoreOnScreen();
    this.monsters.splice(this.monsters.indexOf(monster), 1);
  }

  resetLevel(): void {
    this.walls = [];
    this.platforms = [];
    this.monsters = [];
    this.levelArea.innerHTML = '';
  }

  updateScoreOnScreen(): void {
    this.scoreElement.innerHTML = `Lives: ${this.lives}<br>Score: ${this.score}`;
  }

  gameOver(): void {
    const gameOver: HTMLElement = document.createElement('div');
    gameOver.classList.add('game-over');
    this.viewArea.append(gameOver);
  }

  showAmmo(): void {
    for (let i = 0; i <= 8; i += 1) {
      this.ammoElement.classList.remove(`ammo${i}`);
    }
    this.ammoElement.classList.add(`ammo${this.dave.bullets}`);
  }

  createMeatExplosion(monsterRect: Rect): void {
    for (let i = 0; i <= 3; i += 1) {
      const randDX = 2 + Math.round(Math.random() * 3);
      const dXs: number[] = [-randDX, -randDX - 3, randDX, randDX - 3];
      const meatPart: Meat = {
        area: {
          x: monsterRect.x,
          y: monsterRect.y,
          w: this.meatSizeX,
          h: this.meatSizeY,
        },
        sprite: document.createElement('div'),
        state: ObjectState.JUMPING_UP,
        movedDir: (i > 1) ? Direction.LEFT : Direction.RIGHT,
        velocity: 6,
        dX: dXs[i],
      };
      meatPart.sprite = document.createElement('div');
      meatPart.sprite.classList.add('meat');
      meatPart.sprite.style.width = `${meatPart.area.w}px`;
      meatPart.sprite.style.height = `${meatPart.area.h}px`;
      meatPart.sprite.style.transform = `translate(${meatPart.area.x}px, ${meatPart.area.y}px)`;
      this.meat.push(meatPart);
      this.levelArea.append(meatPart.sprite);
    }
  }

  moveMeatPart(meatPart: Meat, offset: Offset): void {
    meatPart.area.x += offset[0];
    meatPart.area.y += offset[1];
    meatPart.sprite.style.transform = `translate(${meatPart.area.x}px, ${meatPart.area.y}px)`;
  }

  removeMeatPart(meatPart: Meat): void {
    this.meat.splice(this.meat.indexOf(meatPart), 1);
    meatPart.sprite.remove();
  }
}

export default GameView;
