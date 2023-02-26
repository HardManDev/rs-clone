import { UserScore } from '../../types/userScore';
import createElement from '../utils/createElement';
import generateColorFromUserId from '../utils/generateColorFromUserId';

export default function ScoreCard(
  index: number,
  scoreData: UserScore,
): Element {
  return createElement('div', {
    class: 'score-card',
  }, [
    createElement('div', {
      class: 'score-card__main',
    }, [
      createElement('span', {
        class: 'score-card__index',
      }, [document.createTextNode(index.toString())]),
      createElement('div', {
        class: 'score-card__user-avatar',
        style: `background-color: ${generateColorFromUserId(scoreData.user?.id || '')}`,
      }, [
        createElement('span', {
          class: 'score-card__user-avatar-image',
        }, [document.createTextNode(`${scoreData.user?.username}`[0])]),
      ]),
      createElement('div', {
        class: 'score-card__score-info',
      }, [
        createElement('span', {
          class: 'score-card__datetime',
        }, [document.createTextNode(
          `${scoreData.createdAt?.toLocaleDateString()} | ${scoreData.createdAt?.toLocaleTimeString()}`,
        )]),
        createElement('span', {
          class: 'score-card__username',
        }, [document.createTextNode(`${scoreData.user?.username}`)]),
      ]),
    ]),
    createElement('span', {
      class: 'score-card__score',
    }, [document.createTextNode(`${scoreData.score}`)]),
  ]);
}
