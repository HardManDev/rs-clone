import { IPlayerAnimator } from '../../types/interfaces/playerAnimator';
import Direction from '../../types/enums/directions';

class PlayAnimator implements IPlayerAnimator {
  constructor(private readonly playerBlock: HTMLElement) {

  }

  stand(direction: Direction): void {
    const classes = this.playerBlock.classList.toString()
      .replace(/players-[^\s]+/g, '')
      .trim();
    this.playerBlock.removeAttribute('class');
    this.playerBlock.setAttribute(
      'class',
      `${classes} players-animate-stand-${direction}`,
    );
  }

  move(direction: Direction): void {
    const classes = this.playerBlock.classList.toString()
      .replace(/players-[^\s]+/g, '')
      .trim();
    this.playerBlock.removeAttribute('class');
    this.playerBlock.setAttribute(
      'class',
      `${classes} players-animate-move-${direction}`.trim(),
    );
  }

  jump(direction: Direction): void {
    const classes = this.playerBlock.classList.toString()
      .replace(/players-[^\s]+/g, '')
      .trim();
    this.playerBlock.removeAttribute('class');
    this.playerBlock.setAttribute(
      'class',
      `${classes} players-animate-jump-${direction}`.trim(),
    );
  }

  fall(direction: Direction): void {
    const classes = this.playerBlock.classList.toString()
      .replace(/players-[^\s]+/g, '')
      .trim();
    this.playerBlock.removeAttribute('class');
    this.playerBlock.setAttribute(
      'class',
      `${classes} players-animate-fall-${direction}`.trim(),
    );
  }

  look(direction: Direction): void {
    const classes = this.playerBlock.classList.toString()
      .replace(/players-[^\s]+/g, '')
      .trim();
    this.playerBlock.removeAttribute('class');
    this.playerBlock.setAttribute(
      'class',
      `${classes} players-animate-look-${direction}`.trim(),
    );
  }

  shoot(direction: Direction): void {
    const classes = this.playerBlock.classList.toString()
      .replace(/players-[^\s]+/g, '')
      .trim();
    this.playerBlock.removeAttribute('class');
    this.playerBlock.setAttribute(
      'class',
      `${classes} players-animate-shoot-${direction}`.trim(),
    );
  }

  reload(): void {
    const classes = this.playerBlock.classList.toString()
      .replace(/players-[^\s]+/g, '')
      .trim();
    this.playerBlock.removeAttribute('class');
    this.playerBlock.setAttribute(
      'class',
      `${classes} players-animate-reload`.trim(),
    );
  }

  exit(): void {
    const classes = this.playerBlock.classList.toString()
      .replace(/players-[^\s]+/g, '')
      .trim();
    this.playerBlock.removeAttribute('class');
    this.playerBlock.setAttribute(
      'class',
      `${classes} players-animate-exit`.trim(),
    );
  }
}

export default PlayAnimator;
