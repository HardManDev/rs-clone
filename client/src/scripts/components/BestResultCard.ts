import { Score } from '../../types/userScore';
import createElement from '../utils/createElement';

export default function BestResultCard(index: number, score: Score): Element {
  return createElement('div', {
    class: 'best-score',
  }, [
    createElement('div', {
      class: 'best-score__index',
    }, [document.createTextNode(`${index}`)]),
    createElement('div', {
      class: 'best-score__info',
    }, [
      createElement('span', {
        class: 'best-score__datetime',
      }, [document.createTextNode(
        `${score.createdAt?.toLocaleDateString()} | ${score.createdAt?.toLocaleTimeString()}`,
      )]),
      createElement('span', {
        class: 'best-score__score',
      }, [document.createTextNode(`${score.score}`)]),
    ]),
  ]);
}
