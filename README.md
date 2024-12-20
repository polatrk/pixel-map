# pixel-map

## 🧐 What does it contains ?
Pixel-Map is a r/Place like with live changes, user authentication + email verification, and an admin panel where you can tweak a few things.

## 🛠️ Setup

### Installation

Install [NodeJS, npm](https://nodejs.org/en/download/package-manager) and [MySQL](https://dev.mysql.com/doc/refman/8.4/en/linux-installation.html).

Then type those commands:
```bash
git clone https://github.com/pithieLS/pixel-map.git

mysql -u username -p database_name < file.sql

cd ./pixel-map/client && npm install
cd ../server && npm install
```

### Environment Variables

Beforehands, you'll need to setup all the necessary environement variables.

In `/client` and `/server` directories, rename the `.env.template` files to `.env` and replace all the `CHANGE_ME` with the corresponding values

## Usage

- Terminal 1:
```bash
cd /xxx/pixel-map/client && npm start
```

- Terminal 1:
```bash
cd /xxx/pixel-map/server && npm start
```
## 💻 Stack
<p align="left"> <a href="https://getbootstrap.com" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/bootstrap/bootstrap-plain-wordmark.svg" alt="bootstrap" width="40" height="40"/> </a> <a href="https://expressjs.com" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original-wordmark.svg" alt="express" width="40" height="40"/> </a> <a href="https://www.mysql.com/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original-wordmark.svg" alt="mysql" width="40" height="40"/> </a> <a href="https://nodejs.org" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" alt="nodejs" width="40" height="40"/> </a> <a href="https://reactjs.org/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg" alt="react" width="40" height="40"/> </a> </p>
