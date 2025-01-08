# pixel-map 🟥🟧🟨🟩🟦🟪🟫

## 🧐 What does it contains ?
Pixel-Map is a r/Place like with live changes, user authentication + email verification, and an admin panel where you can tweak a few things.

## 🛠️ Setup

### Installation

Install [NodeJS, npm](https://nodejs.org/en/download/package-manager) and [MySQL](https://dev.mysql.com/doc/refman/8.4/en/linux-installation.html).

Then type those commands:
```bash
git clone https://github.com/polatrk/pixel-map.git

mysql -u username -p database_name < database.sql

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

- Terminal 2:
```bash
cd /xxx/pixel-map/server && npm start
```
## 💻 Stack
- React
- Bootstrap
- NodeJS
- Express
- MySQL
- Sequelize
