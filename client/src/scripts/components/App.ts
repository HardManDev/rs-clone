import createElement from '../utils/createElement';
import Header from './Header';
import PlayLevel from '../controllers/playLevel';
import UserAuthForm from './UserAuthForm';

export default function App(playerLevel: PlayLevel): Element {
  return createElement('div', {
    class: 'app',
  }, [
    Header(),
    createElement('div', {
      class: 'app__container',
    }, [playerLevel.gameView.viewArea]),
    UserAuthForm(),
  ]);
}
