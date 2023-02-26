import createElement from '../utils/createElement';
import ScoreCard from './ScoreCard';
import leaderboardController from '../controllers/leaderboardController';
import GetLeaderboardResponse
  from '../api/responses/leaderboard/getLeaderboardResponse';

export default function Leaderboard(): Element {
  let page = 1;
  const limit = 7;

  const fetchItems = (): void => {
    leaderboardController.fetchLeaderboard(page, limit)
      .then(() => {})
      .catch(() => {});
  };

  fetchItems();

  setInterval(() => fetchItems(), 60 * 1000);

  const currentPage = createElement('div', {
    class: 'leaderboard__current-page',
  }, [document.createTextNode(page.toString())]);
  const prevPageButton = createElement('button', {
    class: 'leaderboard__page-button leaderboard__prev-page-button',
    onClick: () => {
      page -= 1;
      fetchItems();
    },
  }, [document.createTextNode('<')]);
  const nextPageButton = createElement('button', {
    class: 'leaderboard__page-button leaderboard__next-page-button',
    onClick: () => {
      page += 1;
      fetchItems();
    },
  }, [document.createTextNode('>')]);
  const pagination = createElement('div', {
    class: 'leaderboard__pagination',
  }, [
    prevPageButton,
    currentPage,
    nextPageButton,
  ]);
  let scoreList = createElement('div', {
    class: 'leaderboard__list',
  }, [
    document.createTextNode('So far it\'s empty :('),
  ]);

  leaderboardController.on('fetching', () => {
    prevPageButton.disabled = true;
    nextPageButton.disabled = true;
  });
  leaderboardController.on('success', (res: GetLeaderboardResponse) => {
    const startIndex = (page - 1) * limit;
    const newScoreList = createElement('div', {
      class: 'leaderboard__list',
    }, [
      ...res.scores
        .map((score, i) => ScoreCard(i + 1 + startIndex, score)),
    ]);

    scoreList.replaceWith(newScoreList);
    scoreList = newScoreList;

    if (Math.ceil((res.totalCount || 0) / limit) > 1) {
      pagination.classList.add('active');
    } else {
      pagination.classList.remove('active');
    }

    prevPageButton.disabled = page === 1;
    nextPageButton.disabled = page === Math.ceil((res.totalCount || 0) / limit)
      || page + 1 > 99 / limit;
    currentPage.textContent = page.toString();
  });

  return createElement('div', {
    class: 'leaderboard',
  }, [
    createElement('h2', {
      class: 'leaderboard__title',
    }, [document.createTextNode('Leaderboard')]),
    scoreList,
    pagination,
  ]);
}
