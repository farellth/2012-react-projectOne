import { SyntheticEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { getUser } from '../actions';
import { UserState } from '../reducer';
import { User } from '../user/user';
import userService from '../user/user.service';

function LoginComponent() {
    const userSelector = (state: UserState) => state.user;
    const user: any = useSelector(userSelector);
    const dispatch: any = useDispatch();
    const history = useHistory();

    function handleFormInput(e: SyntheticEvent) {
        let u: any = {...user};
        if ((e.target as HTMLInputElement).name === 'username'){
            u.username = (e.target as HTMLInputElement).value;
        } else {
            u.password = (e.target as HTMLInputElement).value;
        }
        console.log(JSON.stringify(u));
        dispatch(getUser(u));
    }
    function submitForm() {
        userService.login(user).then((user) => {
            dispatch(getUser(user));
            history.push('/home');
        });
    }

    function logout() {
        userService.logout().then(() => {
            dispatch(getUser(new User()));
            history.push('/home');
        });
    }

    function stayLoggedIn() {
        history.push('/home');
    }

    return (
        <div className='formContainer'>
            { !user.firstName ? (
                <div className='form'>
                    Username: <input type='text' className='form-control' onChange={handleFormInput} name='username'/>
                    <br/>
                    Password: <input type='password' className='form-control' onChange={handleFormInput} name='password'/>
                    <br/>
                    <button className='btn btn-danger' onClick={submitForm}>Login</button>
                </div>
            ) : (
                <div>
                    Are you sure you want to log out?
                    <br/>
                    <button onClick={logout}>Yes</button>
                    <button onClick={stayLoggedIn}>No</button>
                </div>
            )}
        </div>
    );
}

export default LoginComponent;