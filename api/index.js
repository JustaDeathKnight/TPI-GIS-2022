const app = require('./src/app');

const port = process.env.API_PORT || 3000;

app.listen(port, () => {
    console.log('Server listening on port 3000');
} );