import { IPlayerAnimator } from '../../types/interfaces/playerAnimator';
import Direction from '../../types/enums/directions';

class PlayAnimator implements IPlayerAnimator {
  constructor(private readonly playerBlock: HTMLElement) {

  }

  stand(direction: Direction): void {
    this.playerBlock.removeAttribute('class');
    this.playerBlock.setAttribute(
      'class',
      `players-animate-stand-${direction}`,
    );
  }

  move(direction: Direction): void {
    this.playerBlock.removeAttribute('class');
    this.playerBlock.setAttribute(
      'class',
      `players-animate-move-${direction}`,
    );
  }

  jump(direction: Direction): void {
    this.playerBlock.removeAttribute('class');
    this.playerBlock.setAttribute(
      'class',
      `players-animate-jump-${direction}`,
    );
  }

  fall(direction: Direction): void {
    this.playerBlock.removeAttribute('class');
    this.playerBlock.setAttribute(
      'class',
      `players-animate-fall-${direction}`,
    );
  }

  look(direction: Direction): void {
    this.playerBlock.removeAttribute('class');
    this.playerBlock.setAttribute(
      'class',
      `players-animate-look-${direction}`,
    );
  }

  shoot(direction: Direction): void {
    this.playerBlock.removeAttribute('class');
    this.playerBlock.setAttribute(
      'class',
      `players-animate-shoot-${direction}`,
    );
  }

  reload(): void {
    this.playerBlock.removeAttribute('class');
    this.playerBlock.setAttribute(
      'class',
      'players-animate-reload',
    );
  }

  exit(): void {
    this.playerBlock.removeAttribute('class');
    this.playerBlock.setAttribute(
      'class',
      'players-animate-exit',
    );
  }
}

export default PlayAnimator;
