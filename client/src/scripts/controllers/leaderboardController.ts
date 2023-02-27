import { EventEmitter } from 'events';
import api from './apiController';
import GetLeaderboardRequest
  from '../api/requests/leaderboard/getLeaderboardRequest';
import GetScoreRequest from '../api/requests/score/getScoreRequest';

class LeaderboardController extends EventEmitter {
  async fetchLeaderboard(page = 1, limit = 100, sortBy: 'asc' | 'desc' = 'desc'): Promise<void> {
    this.emit('fetching');

    await api.fetch(
      new GetLeaderboardRequest(page, limit, sortBy),
    )
      .then((res) => this.emit('success', res))
      .catch(() => {});
  }

  async fetchUserBestResults(
    page = 1,
    limit = 100,
    sortBy: 'asc' | 'desc' = 'desc',
  ): Promise<void> {
    this.emit('fetchingUserBestResult');

    await api.fetch(
      new GetScoreRequest(page, limit, sortBy),
    )
      .then((res) => this.emit('successUserBestResult', res))
      .catch(() => {});
  }
}

const leaderboardController = new LeaderboardController();
export default leaderboardController;
