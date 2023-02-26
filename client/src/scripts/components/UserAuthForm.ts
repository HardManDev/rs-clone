import createElement from '../utils/createElement';
import api from '../controllers/apiController';
import AuthUserLocalRequest from '../api/requests/auth/authUserLocalRequest';
import { APIResponseError } from '../../types/apiResponseError';

export default function UserAuthForm(): Element {
  const errorLabel = createElement('label', {
    class: 'auth-form__label auth-form__error-label',
  });
  const usernameInput = createElement('input', {
    class: 'auth-form__input auth-form__username-input',
    type: 'text',
    placeholder: 'Enter awesome username...',
  });
  const passwordInput = createElement('input', {
    class: 'auth-form__input auth-form__password-input',
    type: 'password',
    placeholder: 'Enter strong password',
  });
  const passwordConfirmInput = createElement('input', {
    class: 'auth-form__input auth-form__password-confirm-input',
    type: 'password',
    placeholder: 'Repeat password',
  });

  const closeForm = (): void => {
    errorLabel.textContent = '';
    usernameInput.value = '';
    passwordInput.value = '';
    passwordConfirmInput.value = '';

    document.querySelector('.auth-form')?.classList
      .remove('active', 'login', 'register');
  };

  const loginButton = createElement('button', {
    class: 'auth-form__button auth-form__login-button',
    onClick: async () => {
      await api.fetch(
        new AuthUserLocalRequest(
          usernameInput.value.trim(),
          passwordInput.value.trim(),
          'login',
        ),
      )
        .then((res) => {
          if (res.accessToken) {
            closeForm();
          }
        })
        .catch((err: APIResponseError) => {
          if (err.message) {
            errorLabel.textContent = err.message;
          }
        });
    },
  }, [document.createTextNode('Login')]);

  const registerButton = createElement('button', {
    class: 'auth-form__button auth-form__register-button',
    onClick: async () => {
      if (passwordInput.value.trim() !== passwordConfirmInput.value.trim()) {
        errorLabel.textContent = 'Password mismatch!';
        return;
      }

      await api.fetch(
        new AuthUserLocalRequest(
          usernameInput.value.trim(),
          passwordInput.value.trim(),
          'register',
        ),
      )
        .then((res) => {
          if (res.accessToken) {
            closeForm();
          }
        })
        .catch((err: APIResponseError) => {
          if (err.message) {
            errorLabel.textContent = err.message;
          }
        });
    },
  }, [document.createTextNode('Register')]);

  return createElement('div', {
    class: 'auth-form',
    onClick: closeForm,
  }, [
    createElement('div', {
      class: 'auth-form__container',
      onClick: (e: PointerEvent) => {
        e.stopPropagation();
      },
    }, [
      createElement('div', {
        class: 'auth-form__username',
      }, [
        createElement('label', {
          class: 'auth-form__label auth-form__username-label',
        }, [document.createTextNode('Username:')]),
        usernameInput,
      ]),
      createElement('div', {
        class: 'auth-form__password',
      }, [
        createElement('label', {
          class: 'auth-form__label auth-form__password-label',
        }, [document.createTextNode('Password:')]),
        passwordInput,
      ]),
      createElement('div', {
        class: 'auth-form__password-confirm',
      }, [
        createElement('label', {
          class: 'auth-form__label auth-form__password-confirm-label',
        }, [document.createTextNode('Confirm password:')]),
        passwordConfirmInput,
      ]),
      errorLabel,
      loginButton,
      registerButton,
    ]),
  ]);
}
