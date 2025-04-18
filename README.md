# Login Demo with CAPTCHA

A React-based login form demo featuring a secure math CAPTCHA implementation.

## Features

- User authentication form with username and password
- Math-based CAPTCHA with canvas rendering
- Secure visual implementation with noise and wavy text
- Real-time validation
- Modern UI using Material-UI components

## Project Structure

```
login-captcha-demo/
├── public/
│   └── index.html
├── src/
│   ├── App.js
│   └── index.js
├── package.json
└── README.md
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

## CAPTCHA Implementation

The CAPTCHA system features:
- Random math problems (addition)
- Canvas-based rendering
- Visual noise for security
- Refresh capability
- Validation system

## Dependencies

- React 18.2.0
- Material-UI 5.13.0
- React Scripts 5.0.1

## Development

To run in development mode:
```bash
npm start
```

To build for production:
```bash
npm run build
``` 