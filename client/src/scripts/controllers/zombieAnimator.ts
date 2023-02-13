import Direction from '../../types/enums/directions';
import { IZombieAnimator } from '../../types/interfaces/zombieAnimator';

class ZombieAnimator implements IZombieAnimator {
  constructor(private readonly zombieBlock: HTMLElement) {

  }

  move(direction: Direction): void {
    const classes = this.zombieBlock.classList.toString()
      .replace(/zombie-[^\s]+/g, '')
      .trim();
    this.zombieBlock.removeAttribute('class');
    this.zombieBlock.setAttribute(
      'class',
      `${classes} zombie-animate-move-${direction}`.trim(),
    );
  }

  attack(direction: Direction): void {
    const classes = this.zombieBlock.classList.toString()
      .replace(/zombie-[^\s]+/g, '')
      .trim();
    this.zombieBlock.removeAttribute('class');
    this.zombieBlock.setAttribute(
      'class',
      `${classes} zombie-animate-attack-${direction}`.trim(),
    );
  }
}

export default ZombieAnimator;
