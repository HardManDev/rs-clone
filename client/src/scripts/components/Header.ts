import createElement from '../utils/createElement';

export default function Header(): Element {
  const logoImage = createElement('img', {
    class: 'header__logo',
  });
  const loginButton = createElement('button', {
    class: 'header__auth-button login__button',
    onClick: () => {
      document.querySelector('.auth-form')?.classList
        .add('active', 'login');
    },
  }, [document.createTextNode('Login')]);
  const registerButton = createElement('button', {
    class: 'header__auth-button register__button',
    onClick: () => {
      document.querySelector('.auth-form')?.classList
        .add('active', 'register');
    },
  }, [document.createTextNode('Register')]);

  return createElement('header', {
    class: 'app__header header',
  }, [
    logoImage,
    createElement('div', {
      class: 'header__auth login',
    }, [
      loginButton,
      registerButton,
    ]),
  ]);
}
