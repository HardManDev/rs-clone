import createElement from '../utils/createElement';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import rssLogoImage from '../../assets/icons/rss-logo.svg';

export default function Footer(): Element {
  return createElement('footer', {
    class: 'app__footer footer',
  }, [
    createElement('div', {
      class: 'footer__copyright',
    }, [
      createElement('span', {
        class: 'footer__copyright-vendor',
      }, [document.createTextNode(
        'All rights belong to their respective owners.',
      )]),
      createElement('span', {
        class: 'footer__copyright-license',
      }, [document.createTextNode(
        'This is a non-commercial project distributed under the MIT license.',
      )]),
      createElement('span', {
        class: 'footer__copyright-self',
      }, [document.createTextNode(
        'Copyright (c) 2023 HardManDev, VasaSkor, Alexey Zhuchkov. All right reserved.',
      )]),

    ]),
    createElement('div', {
      class: 'footer__authors',
    }, [
      createElement('a', {
        class: 'footer__author-card-link',
        href: 'https://github.com/HardManDev/',
      }, [
        createElement('div', {
          class: 'footer__author-card',
        }, [
          createElement('img', {
            class: 'footer__author-card-avatar',
            src: 'https://avatars.githubusercontent.com/u/98614868?s=40&v=4',
          }),
          createElement('div', {
            class: 'footer__author-card-container',
          }, [
            createElement('span', {
              class: 'footer__author-card-role',
            }, [
              document.createTextNode('Team-lead'),
            ]),
            createElement('span', {
              class: 'footer__author-card-username',
            }, [
              document.createTextNode('HardManDev'),
            ]),
          ]),
        ]),
      ]),
      createElement('a', {
        class: 'footer__author-card-link',
        href: 'https://github.com/jukfloyd/',
      }, [
        createElement('div', {
          class: 'footer__author-card',
        }, [
          createElement('img', {
            class: 'footer__author-card-avatar',
            src: 'https://avatars.githubusercontent.com/u/109034212?s=40&v=4',
          }),
          createElement('div', {
            class: 'footer__author-card-container',
          }, [
            createElement('span', {
              class: 'footer__author-card-role',
            }, [
              document.createTextNode('Gameplay'),
            ]),
            createElement('span', {
              class: 'footer__author-card-username',
            }, [
              document.createTextNode('jukfloyd'),
            ]),
          ]),
        ]),
      ]),
      createElement('a', {
        class: 'footer__author-card-link',
        href: 'https://github.com/vasaskor',
      }, [
        createElement('div', {
          class: 'footer__author-card',
        }, [
          createElement('img', {
            class: 'footer__author-card-avatar',
            src: 'https://avatars.githubusercontent.com/u/106305964?s=40&v=4',
          }),
          createElement('div', {
            class: 'footer__author-card-container',
          }, [
            createElement('span', {
              class: 'footer__author-card-role',
            }, [
              document.createTextNode('Styling'),
            ]),
            createElement('span', {
              class: 'footer__author-card-username',
            }, [
              document.createTextNode('VasaSkor'),
            ]),
          ]),
        ]),
      ]),
    ]),
    createElement('a', {
      class: 'footer__logo',
      href: 'https://rs.school/js/',
    }, [
      createElement('img', {
        class: 'footer__logo-image',
        src: rssLogoImage,
      }),
    ]),
  ]);
}
