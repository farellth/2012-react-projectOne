import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { User } from './user';
import dynamo from '../dynamo/dynamo';
import log from '../log';

class UserService {
    private doc: DocumentClient;
    constructor() {
        this.doc = dynamo;
    }

    async getUserByUsername(username: string): Promise<User|null> {
        const params = {
            TableName: 'users',
            Key: {
                'username': username
            }
        };
        return await this.doc.get(params).promise().then((data) => {
            if (data && data.Item) {
                log.debug('Retrieved requested user');
                return data.Item as User;
            } else {
                log.error('Failed to retrieve user');
                return null;
            }
        });
    }

    async addUser(user: User): Promise<boolean> {
        const params = {
            TableName: 'users',
            Item: user,
            ConditionExpression: '#u <> :username',
            ExpressionAttributeNames: {
                '#u': 'username'
            },
            ExpressionAttributeValues: {
                ':username': user.username
            }
        };
        return await this.doc.put(params).promise().then((result) => {
            log.debug('Successfully added user');
            return true;
        }).catch((err) => {
            log.error('Failed to add user: ' + err);
            return false;
        });
    }

    async updateUser(user: User): Promise<boolean> {
        const params = {
            TableName: 'users',
            Key: {
                'username': user.username
            },
            UpdateExpression: 'set #availReimb = :v, #pendReimb = :p, #awardReimb = :w',
            ExpressionAttributeValues: {
                ':v': user.availReimb,
                ':p': user.pendReimb,
                ':w': user.awardReimb
            },
            ExpressionAttributeNames: {
                '#availReimb': 'availReimb',
                '#pendReimb': 'pendReimb',
                '#awardReimb': 'awardReimb'
            },
            ReturnValues: 'UPDATED_NEW'
        };

        return await this.doc.update(params).promise().then((data) => {
            log.debug('Successfully updated to: ' + data);
            return true
        }).catch((err) => {
            log.error('Failed to update user: ' + err);
            return false;
        });
    }
}

const userService = new UserService;
export default userService;