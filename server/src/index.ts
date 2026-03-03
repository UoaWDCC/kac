import express from 'express';

const app: express.Application = express();

const port: number = 3000;

app.get('/', (req, res) => {
    res.send("Hi :)");
});

app.listen(port, () => {
    console.log(`App is live on port ${port}`);
});
