import createElement from '../utils/createElement';
import UserProfile from './UserProfile';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import logoImage from '../../assets/logo.png';

export default function Header(): Element {
  return createElement('header', {
    class: 'app__header header',
  }, [
    createElement('img', {
      class: 'header__logo',
      src: logoImage,
      style: 'margin-top: -5px; width: 464px;',
    }),
    UserProfile(),
  ]);
}
