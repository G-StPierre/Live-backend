# Live-Backend

## Description

Express.js backend created for a basic livestreaming platform. Based on similar live stream platforms such as twitch, youtube, etc. Created to learn more about Azure Media Services and websockets.

## Installation

This project uses pnpm rather than npm. To install pnpm see https://github.com/pnpm/pnpm.

To run the application, follow these steps:

1. Install dependencies
```node.js
pnpm i
```

2. Compile the typescript to javascript
``` node.js
pnpm build
```

3. Run the software
```node.js
pnpm start
```
Note: The following should be in a .env file where secret is used to hash user passwords.

```
SECRET={}
DATABASE_USER={}
DATABASE_HOST={}
DATABASE={}
DATABASE_PASS={}
DATABASE_PORT={}
```