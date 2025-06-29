# Password-Manager

## How to use
Once you create an account, you can login and directly access the dashboard. Passwords for websites can be added along with their usernames. The stored entries can be modified or deleted.

## Hosting
This MERN based project is entirely hosted on AWS. The backend is deployed using AWS Elastic Beanstalk environment. The frontent is deployed using AWS Amplify with SSL certificate via AWS Certificate Manager. Mongo provides a secure cloud database for user and password storage with schema-based access controls.

## How it works behind the scenes
Master keys are hashed with bcrypt and never stored in plaintext. The plaintext Master key is used for client side encryption and decryption of passwords. bcrypt includes salting and stretching, defending against rainbow table and brute-force attacks.

The user passwords are encrypted using AES via crypto-js with keys derived from PBKDF2. The derived key is generated using PBKDF2 + salt (email) for strong symmetric encryption.

Middleware restricts password actions to only the authenticated user.

## Additional Security
Token-based session management for secure, stateless auth is implemented via JWT Authentication with HttpOnly Cookies. HttpOnly cookies cannot be accessed via JS, making them safer for tokens.

Configured strict cross-origin access with credentials-based session handling.
