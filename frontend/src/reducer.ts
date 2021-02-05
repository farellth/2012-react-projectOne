import * as Actions from './actions';
import { User } from './user/user';
import { Reimb } from './reimb/reimb';

export interface UserState {
    user: User;
    targetUser: User;
}

export interface ReimbState {
    reimbs: Reimb[];
    reimb: Reimb;
}

export interface AppState extends UserState, ReimbState {}

const initialState: AppState = {
    user: new User(),
    targetUser: new User(),
    reimbs: [],
    reimb: new Reimb()

}

const reducer = (state: AppState = initialState, action: Actions.AppAction): AppState => {
    console.log(action);
    const newState = {...state};

    switch (action.type) {
        case Actions.UserActions.GetUser:
            console.log(action.type);
            newState.user = action.payload as User;
            return newState;
        case Actions.UserActions.GetTargetUser:
            console.log(action.type);
            newState.targetUser = action.payload as User;
            return newState;
        case Actions.ReimbActions.GetReimbs:
            console.log(action.type);
            newState.reimbs = action.payload as Reimb[];
            return newState;
        case Actions.ReimbActions.GetReimb:
            console.log(action.type);
            newState.reimb = action.payload as Reimb;
            return newState;
        case Actions.ReimbActions.UpdateReimb:
            console.log(action.type);
            newState.reimb = action.payload as Reimb;
            console.log('Action payload: ' + newState.reimb);
            return newState;
        default:
            console.log('No action given');
            return state;
    }
}

export default reducer;