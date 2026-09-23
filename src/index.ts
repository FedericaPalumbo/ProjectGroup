import 'dotenv/config';
import 'reflect-metadata';
import { createServer } from 'http';
import app from './app';
import mongoose from 'mongoose';

const server = createServer(app);

mongoose.set('debug', true);
mongoose.connect('mongodb+srv://dallavecchiamattia05_db_user:ylhzHmILwTDpuvw1@projectwork.dxpxfmg.mongodb.net/ProjectWork?appName=ProjectWork')
    .then(_ => {
        createServer(app).listen(3000, () => {
            console.log('Server listening on port 3000');
        });
    })
    .catch(err => {
        console.error(err);
    })

