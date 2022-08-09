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
- Login (/auth/logout) - requires post method and email and password fields
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
