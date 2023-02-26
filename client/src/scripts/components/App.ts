import createElement from '../utils/createElement';
import Header from './Header';
import PlayLevel from '../controllers/playLevel';
import UserAuthForm from './UserAuthForm';
import Leaderboard from './Leaderboard';

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
      createElement('div', {
        style: 'display: flex; width: 485px',
      }),
    ]),
    UserAuthForm(),
  ]);
}
