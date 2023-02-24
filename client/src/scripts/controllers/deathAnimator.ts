import { IDeathAnimator } from '../../types/interfaces/deathAnimator';
import Death from '../../types/enums/death';

class DeathAnimator implements IDeathAnimator {
  constructor(private readonly deathBlock: HTMLElement) {

  }

  death(death: Death): void {
    const classes = this.deathBlock.classList.toString()
      .replace(/death-[^\s]+/g, '')
      .trim();
    this.deathBlock.removeAttribute('class');
    this.deathBlock.setAttribute(
      'class',
      `${classes} death-animate-${death}`.trim(),
    );
  }
}

export default DeathAnimator;
