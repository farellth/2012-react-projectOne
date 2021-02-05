import express from 'express';

import log from '../log';
import reimbService from './reimb.service';

const router = express.Router();

router.get('/', function(req, res, next) {
    log.debug('Attemping to get reimbursement list');
    reimbService.getAllReimbs().then((reimbs) => {
        res.send(JSON.stringify(reimbs));
    });
});

router.get('/:id', function(req, res, next) {
    log.debug('Attempting to retrieve reimbursement');
    log.debug('Searching for reimbursement with id: '+req.params.id);
    reimbService.getReimbById(req.params.id).then((reimb) => {
        res.send(JSON.stringify(reimb));
    });
});

router.post('/', function(req, res, next) {
    log.debug('Attempting to add new reimbursement request');
    log.debug('Adding reimbursement as follows: ' + req.params);
    reimbService.addReimb(req.body).then((data) => {
        res.sendStatus(201);
    }).catch((err) => {
        res.sendStatus(500);
    });
});

router.put('/', function(req, res, next) {
    log.debug('Attemping to update existing reimbursement request');
    log.debug('Updating existing reimbursement with following details: ' + req.params);
    reimbService.updateReimb(req.body).then((data) => {
        res.sendStatus(200);
    }).catch((err) => {
        res.sendStatus(500);
    });
});

export default router;