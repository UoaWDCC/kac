import express from 'express';

const app: express.Application = express();

const port: number = 3000;

app.get('/api', (req, res) => {
    res.send("Hi :)");
});

app.listen(port, () => {
    console.log(`Server application listening on port ${port}`);
});
