import { User } from './user/user';
import { Reimb } from './reimb/reimb';

export enum UserActions {
    GetUser = 'GET_USER',
    GetTargetUser = 'GET_TARGET_USER',
    UpdateUser = 'UPDATE_USER'
}

export enum ReimbActions {
    GetReimbs = 'GET_REIMBS',
    GetReimb = 'GET_REIMB',
    UpdateReimb = 'UPDATE_REIMB'
}

export interface AppAction {
    type: string;
    payload: any;
}

export interface UserAction extends AppAction {
    type: UserActions;
    payload: User;
}

export interface ReimbAction extends AppAction {
    type: ReimbActions;
    payload: Reimb | Reimb[];
}

export function getUser(user: User): UserAction {
    const action: UserAction = {
        type: UserActions.GetUser,
        payload: user
    }
    return action;
}

export function getTargetUser(user: User): UserAction {
    const action: UserAction = {
        type: UserActions.GetTargetUser,
        payload: user
    }
    return action;
}

export function updateUser(user: User): UserAction {
    console.log('updateUser payload: ' + JSON.stringify(user));
    const action: UserAction = {
        type: UserActions.UpdateUser,
        payload: user
    }
    return action;
}

export function getAllReimbs(reimbs: Reimb[]): ReimbAction {
    const action: ReimbAction = {
        type: ReimbActions.GetReimbs,
        payload: reimbs
    }
    return action;
}

export function getReimb(reimb: Reimb): ReimbAction {
    const action: ReimbAction = {
        type: ReimbActions.GetReimb,
        payload: reimb
    }
    return action;
}

export function updateReimb(reimb: Reimb): ReimbAction {
    console.log('Payload: ' + JSON.stringify(reimb));
    const action: ReimbAction = {
        type: ReimbActions.UpdateReimb,
        payload: reimb
    }
    return action;
}