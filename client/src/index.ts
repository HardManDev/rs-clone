import '@styles/main';

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
