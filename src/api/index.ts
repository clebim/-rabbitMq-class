import App from './app';

function startApp() {
  Promise.resolve()
    .then(() => {
      const app = new App();
      app.start();
    });
}

startApp();
