import { createServer } from 'http';
import staticHandler from 'serve-handler';
import ws, {WebSocketServer} from 'ws';

import express from 'express'
import {router as userRouter}  from './controller/userController';
import cors from 'cors';

const router = express.Router();

const app = express();

app.use(express.json());
app.use(router)
app.use(cors())

app.use('/api/user', userRouter)

app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
