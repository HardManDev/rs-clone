import Direction from '../../types/enums/directions';
import { ICroneAnimator } from '../../types/interfaces/croneAnimator';

class CroneAnimator implements ICroneAnimator {
  constructor(private readonly croneBlock: HTMLElement) {

  }

  move(direction: Direction): void {
    const classes = this.croneBlock.classList.toString()
      .replace(/crone-[^\s]+/g, '')
      .trim();
    this.croneBlock.removeAttribute('class');
    this.croneBlock.setAttribute(
      'class',
      `${classes} crone-animate-move-${direction}`.trim(),
    );
  }

  attack(direction: Direction): void {
    const classes = this.croneBlock.classList.toString()
      .replace(/crone-[^\s]+/g, '')
      .trim();
    this.croneBlock.removeAttribute('class');
    this.croneBlock.setAttribute(
      'class',
      `${classes} crone-animate-attack-${direction}`.trim(),
    );
  }
}

export default CroneAnimator;
