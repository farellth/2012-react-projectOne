import log from '../log';
import userService from './user.service';

export interface User {
    username: string;
    password: string;
    usernameSuper?: string;
    firstName: string;
    lastName: string;
    role: string;
    availReimb: number;
    pendReimb: number;
    awardReimb: number;
}

export async function login(username: string, password: string): Promise<User|null> {
    log.debug(`Attempting to login with username: '${username}' and password: '${password}'`);
    return await userService.getUserByUsername(username).then((user) => {
        if (user && user.password === password) {
            log.debug('Successful login');
            return user;
        } else {
            log.error('Failed login');
            return null;
        }
    })
}