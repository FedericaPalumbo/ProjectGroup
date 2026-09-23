import 'dotenv/config';
import 'reflect-metadata';
import { createServer } from 'http';
import app from './app';
import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    throw new Error('MONGO_URI non impostata (vedi .env)');
}

const server = createServer(app);

mongoose.set('debug', true);
mongoose.connect(MONGO_URI)
    .then(_ => {
        createServer(app).listen(3000, () => {
            console.log('Server listening on port 3000');
        });
    })
    .catch(err => {
        console.error(err);
    })