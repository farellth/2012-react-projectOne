import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import dynamo from '../dynamo/dynamo';

import log from '../log';
import { Reimb } from './reimb';

class ReimbService {
    private doc: DocumentClient;
    constructor() {
        this.doc = dynamo;
    }

    async getAllReimbs(): Promise<Reimb[]> {
        const params = {
            TableName: 'reimbursements'
        }

        return this.doc.scan(params).promise().then((data) => {
            return data.Items as Reimb[];
        }).catch((err) => {
            log.error('Failed to retrieve reimbursement list: ' + err);
            return [];
        });
    }

    async getReimbById(idReimb: string): Promise<Reimb | null> {
        const params = {
            TableName: 'reimbursements',
            Key: {
                'idReimb': idReimb
            }
        };

        return await this.doc.get(params).promise().then((data) => {
            if (data && data.Item) {
                log.debug('Successfully retrieved reimbursement');
                return data.Item as Reimb;
            } else {
                log.error('Failed to retrieve reimbursement');
                return null;
            }
        });
    }

    async addReimb(reimb: Reimb): Promise<boolean> {
        log.debug(reimb);
        const params = {
            TableName: 'reimbursements',
            Item: reimb,
            ConditionExpression: '#idReimb <> :idReimb',
            ExpressionAttributeNames: {
                '#idReimb': 'idReimb'
            },
            ExpressionAttributeValues: {
                ':idReimb': reimb.idReimb
            }
        }

        return await this.doc.put(params).promise().then(() => {
            log.debug('Successfully added reimbursement request');
            return true;
        }).catch((err) => {
            log.error('Failed to add reimbursement request: ' + err);
            return false;
        });
    }

    async updateReimb(reimb: Reimb): Promise<boolean> {
        const params = {
            TableName: 'reimbursements',
            Key: {
                'idReimb': reimb.idReimb
            },
            UpdateExpression: 'set #requestorDetails = :r, #usernameAssigned = :u, #course = :c, #approval = :a',
            ExpressionAttributeValues: {
                ':r': reimb.requestorDetails,
                ':u': reimb.usernameAssigned,
                ':c': reimb.course,
                ':a': reimb.approval
            },
            ExpressionAttributeNames: {
                '#requestorDetails': 'requestorDetails',
                '#usernameAssigned': 'usernameAssigned',
                '#course': 'course',
                '#approval': 'approval'
            },
            ReturnValues: 'UPDATED_NEW'
        };

        return await this.doc.update(params).promise().then((data) => {
            log.debug('Successfully updated to: ' + data);
            return true
        }).catch((err) => {
            log.error('Failed to update reimbursement request: ' + err);
            return false;
        });
    }

    async removeReimb(idReimb: string): Promise<boolean> {
        const params = {
            TableName: 'reimbursements',
            Key: {
                'idReimb': idReimb
            }
        }

        return await this.doc.delete(params).promise().then((result) => {
            log.debug('Succesfully removed reimbursement');
            return true;
        }).catch((err) => {
            log.error('Failed to remove reimbursement: ', err);
            return false;
        });
    }
}

const reimbService = new ReimbService();
export default reimbService;