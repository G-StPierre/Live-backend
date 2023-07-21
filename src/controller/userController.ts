import express from 'express';
import {getUserByUsername, createUser, deleteUserByUsername, authenticateToken, login, authenticateTokenToUsername, getUserByUsernameClean} from '../service/user.service';
const router = express.Router();

router.get('/:username', async (req, res) => {
    let authHeader = req.headers['authorization']
    if(!authHeader) {
        let result = await getUserByUsernameClean(req.params.username);
        res.status(200).send(result);
        return;
    }

    let authResult = authenticateToken(authHeader)
    let authUserResult = authenticateTokenToUsername(authHeader, req.params.username)

    if(authResult === -1){
        res.status(401).send();
        return;
    } else if (authResult === 0 || !authUserResult) {
        let result = await getUserByUsernameClean(req.params.username);
        res.status(200).send(result);
        return;
    }

    let result = await getUserByUsername(req.params.username);
    res.status(200).send(result)
});

router.post('/', async (req, res) => {
    let result = await createUser(req.body.username, req.body.password, req.body.email, req.body.bio);
    res.status(200).send(result)
});

router.post('/login', async (req, res) => {
    try{
        let result = await login(req.body.username, req.body.password);
        res.status(200).send(result)
    } catch (err) {
        res.status(401).send(err)
    }
})

router.delete('/:username', async (req, res) => {
    let authHeader = req.headers['authorization']
    if(!authHeader) {
        res.status(401).send();
        return;
    }
    let authResult = authenticateToken(authHeader);
    let authUserResult = authenticateTokenToUsername(authHeader, req.params.username)

    if(authResult === -1){
        res.status(401).send();
        return;
    } else if (authResult === 0 || !authUserResult) {
        res.status(403).send();
        return;
    }
    await deleteUserByUsername(req.params.username);
    res.status(204).send();
});

router.put('/:username', async (req, res) => {
    let authHeader = req.headers['authorization']
    if(!authHeader) {
        res.status(401).send();
        return;
    }
    let authResult = authenticateToken(authHeader);
    let authUserResult = authenticateTokenToUsername(authHeader, req.params.username)
    if(authResult === -1){
        res.status(401).send();
        return;
    }
    else if (authResult === 0 || !authUserResult) {
        res.status(403).send();
        return;
    }
});

export {router}