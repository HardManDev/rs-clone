import '@styles/main';
import PlayLevel from './scripts/controllers/playLevel';

const playLevel = new PlayLevel();
playLevel.startGame();

(
  async (): Promise<void> => {
    const text = await fetch(
      `${process.env.API_URL}`,
      {
        method: 'GET',
      },
    )
      .then((res) => res.text());

    console.log(text);
  }
)();
