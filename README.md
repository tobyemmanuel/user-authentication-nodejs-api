# User authentication using NodeJs, Bcryptjs, Jsonwebtoken, and Expressjs

> This is a simple project of a user and role authentication system using NodeJs.

## Technologies/Modules/Dependencies used

- NodeJs
- ExpressJs
- Nodemailer
- Express-validator
- Bcryptjs
- JsonWebToken (JWT)
- Mongoose
- Dotenv

## How it works (available APIs)

- Register user (/auth/register) - requires post method and email, username, and password fields
- Password recovery (/auth/passwordrecovery) - requires post method and email field
- Password reset (/auth/passwordreset) - requires post method and email, resetToken (from email), and password fields
- Login (/auth/login) - requires post method and email and password fields
- Logout (/auth/logout)
- Protected routes for loggedin users, admin, manager, and staff

## Screenshots of working APIs

![Register User](register.png "Register User")

![Login](login.png "Login")

![logout](logout.png "Logout")

![Password Recovery](passwordrecovery.png "Password Recovery")

![Password Reset](passwordreset.png "Password Reset")

![Staff Route](staffroute.png "Staff Route")

![Admin Route](adminroute.png "Admin Route")

![Manager Route](manager.png "Manager Route")

![Logged in User Route](loggedinuser.png "Logged in User Route")

## Installation / Setting up the variables

- Install nodejs and npm
- Clone the repository to a folder - [User Authentication](https://github.com/tobyemmanuel/user-authentication-nodejs-api)
  `git clone https://github.com/tobyemmanuel/user-authentication-nodejs-api`
- Navigate to the local repository to configure the app.
- run `npm install` in the terminal of your vscode. If you done correct to this stage, at the end of the process, you will see words along these lines on your terminal.

  run `npm fund` for details
  found ..... severity vunerablity
  run `npm audit fix` to fix them or `npm audit` for details

You will also see your package-lock.json file and node_modules folder at the left side of the vscode window.

- After cloning the repo, Create a dotenv document.
- Set up the variables as seen in the [Variables setup](variables.txt) document. You can rename this document as dotenv and input your variables.
- See this [link](https://www.freecodecamp.org/news/use-nodemailer-to-send-emails-from-your-node-js-server/) to set up your GMAIL API for the mailer system.
- You can test the APIs as seen in the screenshots with Thunder Client or Postman
