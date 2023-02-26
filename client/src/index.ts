import '@styles/main';
import PlayLevel from './scripts/controllers/playLevel';
import App from './scripts/components/App';

const playLevel = new PlayLevel();

document.body.appendChild(App(playLevel));

playLevel.startGame();
