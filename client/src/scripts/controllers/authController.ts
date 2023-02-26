import { EventEmitter } from 'events';
import api from './apiController';
import AuthUserLocalRequest from '../api/requests/auth/authUserLocalRequest';
import GetUserInfoRequest from '../api/requests/user/getUserInfoRequest';
import deleteCookie from '../utils/deleteCookie';

class AuthController extends EventEmitter {
  async loginUserLocal(username?: string, password?: string): Promise<void> {
    if (!username || !password) {
      await api.fetch(
        new GetUserInfoRequest(),
      )
        .then((res) => this.emit('loginSuccess', res))
        .catch(() => {});
      return;
    }

    if (username && (username.trim() === '' || username.length < 3)) {
      this.emit(
        'loginFailed',
        new Error('Username must be more than 3 characters!'),
      );
      return;
    }

    if (password && (password.trim() === '' || password.length < 8)) {
      this.emit(
        'loginFailed',
        new Error('Password must be more than 8 characters!'),
      );
      return;
    }

    await api.fetch(
      new AuthUserLocalRequest(
        username.trim(),
        password.trim(),
        'login',
      ),
    )
      .then((res) => this.emit('loginSuccess', res))
      .catch((err) => this.emit('loginFailed', err));
  }

  async registerUserLocal(
    username: string,
    password: string,
    confirmPassword: string,
  ): Promise<void> {
    if (username.trim() === '' || username.length < 3) {
      this.emit(
        'registerFailed',
        new Error('Username must be more than 3 characters!'),
      );
      return;
    }

    if (username.length > 12) {
      this.emit(
        'registerFailed',
        new Error('The username must be no more than 12 characters!'),
      );
      return;
    }

    if (password.trim() === '' || password.length < 8) {
      this.emit(
        'registerFailed',
        new Error('Password must be more than 8 characters!'),
      );
      return;
    }

    if (confirmPassword.trim() === '') {
      this.emit(
        'registerFailed',
        new Error('Please confirm your password!'),
      );
      return;
    }

    if (confirmPassword.trim() !== password.trim()) {
      this.emit(
        'registerFailed',
        new Error('Password mismatch!'),
      );
      return;
    }

    await api.fetch(
      new AuthUserLocalRequest(
        username.trim(),
        password.trim(),
        'register',
      ),
    )
      .then((res) => this.emit('registerSuccess', res))
      .catch((err) => this.emit('registerFailed', err));
  }

  userLogout(): void {
    deleteCookie('auth_token');

    this.emit('userLogout');
  }
}

const authController = new AuthController();
export default authController;
