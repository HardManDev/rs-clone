# RS Clone
[![LICENSE](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Linters checks](https://github.com/HardManDev/rs-clone/actions/workflows/linterChecks.yml/badge.svg)](https://github.com/HardManDev/rs-clone/actions/workflows/linterChecks.yml)
[![Netlify Status](https://api.netlify.com/api/v1/badges/94ea65cd-5857-4022-a8f4-923b64062608/deploy-status?style=flat-square)](https://app.netlify.com/sites/hardmandev-rs-clone/deploys)

[RSSchool](https://rs.school/) final
[task](https://github.com/rolling-scopes-school/tasks/blob/master/tasks/rsclone/rsclone.md).

## Documentation
[![Run in Postman](https://run.pstmn.io/button.svg)](https://god.gw.postman.com/run-collection/19172739-501a8909-9425-4213-b8ea-ccc0d8cd0817?action=collection%2Ffork&collection-url=entityId%3D19172739-501a8909-9425-4213-b8ea-ccc0d8cd0817%26entityType%3Dcollection%26workspaceId%3D82b9cb23-0a2f-430a-b89d-751ccaa7f4bc)
> API Documentation in postman \
> NOTE: For test fork this postman collection

## Build
#### Build a server:
```bash
cd ./server
npm install
npm run build
```
> NOTE: Build result folder: ./server/dist
#### Build a client:
```bash
cd ./client
npm install
npm run build
```
> NOTE: Build result folder: ./client/dist

## Start
#### Start a server:
```bash
cd ./server
npm run start:dev
```
> NOTE: Default URL: http://localhost:3000
#### Start a client:
```bash
cd ./client
npm run start:dev
```
> NOTE: Default URL: http://localhost:8080

## Development stack
  - [TypeScript](https://github.com/microsoft/TypeScript)
  - [ESLint](https://github.com/eslint/eslint) - for lint source code
#### Front-end
  - CSS
  - [SASS](https://github.com/sass/sass)
  - [Webpack](https://github.com/webpack/webpack) - for build project
  - [StyleLint](https://github.com/stylelint/stylelint) - for lint styles
#### Back-end
  - [Prettier](https://github.com/prettier/prettier)
  - ❤️[NestJS](https://github.com/nestjs/nest) - back-end framework
  - [MongoDB](https://github.com/mongodb/mongo) - database for back-end
  - [mongoose](https://github.com/nestjs/mongoose) - ORM for work with MongoDB
  - [JWT](https://jwt.io/) - for simple authorization & authentication
  - [bcrypt](https://github.com/pyca/bcrypt) - for encrypt passwords
#### Deploy
  - [Netlify](https://netlify.app/) - for deploy front-end
  - [Railway](https://railway.app/) - for deploy back-end
#### Team work
  - Git Flow
  - [GitHub Projects](https://github.com/users/HardManDev/projects/10)
  - [GitHub Actions](https://github.com/HardManDev/rs-clone/actions) - for lint project on pull request
  
> *Read more at [Dependency graph](https://github.com/HardManDev/rs-clone/network/dependencies)*

## License
This software is licensed under the
[MIT license](https://opensource.org/licenses/MIT).
Please see the [LICENSE file](LICENSE) for more information.

> You can do whatever you want as long as you include the original copyright and
> license notice in any copy of the software/source.

\
RS Clone
\
*Copyright (c) 2023 HardManDev, VasaSkor, Alexey Zhuchkov. All right reserved.*
