import createElement from '../utils/createElement';
import Header from './Header';
import PlayLevel from '../controllers/playLevel';
import UserAuthForm from './UserAuthForm';
import Leaderboard from './Leaderboard';
import BestResults from './BestResults';

export default function App(playerLevel: PlayLevel): Element {
  return createElement('div', {
    class: 'app',
  }, [
    Header(),
    createElement('div', {
      class: 'app__container',
    }, [
      Leaderboard(),
      playerLevel.gameView.viewArea,
      BestResults(),
    ]),
    UserAuthForm(),
  ]);
}
