import createElement from '../utils/createElement';
import BestResultCard from './BestResultCard';
import leaderboardController from '../controllers/leaderboardController';
import authController from '../controllers/authController';
import GetScoreResponse from '../api/responses/score/getScoreResponse';

export default function BestResults(): Element {
  const placeholder = document.createTextNode(
    'Authorize to save and see the best results!',
  );
  let list = createElement('div', {
    class: 'best-results__list',
  }, [
    placeholder,
  ]);

  const fetchUserBestResult = (): void => {
    leaderboardController.fetchUserBestResults(1, 10)
      .then(() => {
        placeholder.textContent = 'You haven\'t set a record yet!';
      })
      .catch(() => {});
  };

  authController.on('loginSuccess', fetchUserBestResult);
  authController.on('registerSuccess', fetchUserBestResult);
  authController.on('userLogout', () => {
    list.replaceChildren(placeholder);

    placeholder.textContent = 'Authorize to save and see the best results!';
  });
  leaderboardController.on('successUserBestResult', (res: GetScoreResponse) => {
    if (res.scores.length < 1) {
      placeholder.textContent = 'You haven\'t set a record yet!';
      return;
    }

    const newList = createElement('div', {
      class: 'best-results__list',
    }, [
      ...res.scores
        .map((score, i) => BestResultCard(i + 1, score)),
    ]);

    list.replaceWith(newList);
    list = newList;
  });
  leaderboardController.on('scoreCreated', fetchUserBestResult);

  return createElement('div', {
    class: 'best-results hide',
  }, [
    createElement('div', {
      class: 'leaderboard__header',
    }, [
      createElement('h2', {
        class: 'best-results__title',
      }, [
        document.createTextNode('Best results'),
      ]),
      createElement('button', {
        class: 'best-results__hide-button',
        onClick: () => {
          const hideButton = document.querySelector('.best-results__hide-button');
          const targetElement = document.querySelector('.best-results');

          if (targetElement) {
            targetElement.classList.toggle('hide');
          }

          if (hideButton && targetElement) {
            hideButton.textContent = targetElement.classList.contains('hide') ? '<<' : '>>';
          }
        },
      }, [document.createTextNode('<<')]),
    ]),
    list,
  ]);
}
