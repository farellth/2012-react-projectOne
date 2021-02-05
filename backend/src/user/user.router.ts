import express from 'express';
import * as user from './user';
import log from '../log';
import userService from './user.service';

const router = express.Router();

router.get('/:id', function(req: any, res, next) {
    log.debug('Attempting to retrieve user');
    log.debug('Searching for user with username: ' + req.params.id)
    userService.getUserByUsername(req.params.id).then((user) => {
        if(user) {
            res.send(JSON.stringify(user));
            log.debug('Successfully retrieved user');
        } else {
            log.debug('Failed to retrieve user');
        }
    });
});

router.post('/', function(req: any, res, next) {
    log.debug(req.body);
    user.login(req.body.username, req.body.password).then((user) => {
        if (user === null) {
            res.sendStatus(401);
        }
        req.session.user = user;
        res.send(JSON.stringify(user));
    });
});

router.put('/', function(req, res, next) {
    log.debug('Attempting to update existing user');
    log.debug('Updating existing user with following details: ' + req.params);
    userService.updateUser(req.body).then((data) => {
        res.sendStatus(200);
    }).catch((err) => {
        res.sendStatus(500);
    });
});

router.delete('/', (req, res, next) => {
    req.session.destroy((err) => log.error(err));
    res.sendStatus(204);
});

export default router;