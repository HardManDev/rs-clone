import createElement from '../utils/createElement';
import UserProfile from './UserProfile';

export default function Header(): Element {
  const logoImage = createElement('img', {
    class: 'header__logo',
  });

  return createElement('header', {
    class: 'app__header header',
  }, [
    logoImage,
    UserProfile(),
  ]);
}
