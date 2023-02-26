import createElement from '../utils/createElement';
import GetUserInfoResponse from '../api/responses/user/getUserInfoResponse';
import authController from '../controllers/authController';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import exitIcon from '../../assets/icons/exit.svg';
import generateColorFromUserId from '../utils/generateColorFromUserId';

let isFirstRender = true;

export default function UserProfile(): Element {
  if (isFirstRender) {
    isFirstRender = false;
    authController.loginUserLocal()
      .then(() => {})
      .catch(() => {});
  }

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
  const userAvatarImage = createElement('span', {
    class: 'user-profile__avatar-image',
  });
  const userAvatar = createElement('div', {
    class: 'user-profile__avatar',
  }, [
    userAvatarImage,
  ]);
  const userId = createElement('span', {
    class: 'user-profile__id',
  });
  const username = createElement('span', {
    class: 'user-profile__username',
  });
  const authButtons = createElement('div', {
    class: 'user-profile__auth-buttons active',
  }, [
    loginButton,
    registerButton,
  ]);
  const userInfo = createElement('div', {
    class: 'user-profile__user',
  }, [
    userAvatar,
    createElement('div', {
      class: 'user-profile__user-info',
    }, [
      userId,
      username,
    ]),
    createElement('img', {
      class: 'user-profile__exit-button',
      src: exitIcon,
      onClick: () => {
        authController.userLogout();
      },
    }),
  ]);

  const onUserAuth = (user: GetUserInfoResponse): void => {
    authButtons.classList.remove('active');
    userInfo.classList.add('active');

    userAvatarImage.textContent = (`${user.username}`)[0].toString();
    userAvatar.style.backgroundColor = generateColorFromUserId(user.id || '');
    userId.textContent = `${user.id}`;
    username.textContent = `${user.username}`;
  };

  authController.on('loginSuccess', onUserAuth);
  authController.on('registerSuccess', onUserAuth);
  authController.on('userLogout', () => {
    userInfo.classList.remove('active');
    authButtons.classList.add('active');
  });

  return createElement('div', {
    class: 'header__user-profile user-profile',
  }, [
    userInfo,
    authButtons,
  ]);
}
