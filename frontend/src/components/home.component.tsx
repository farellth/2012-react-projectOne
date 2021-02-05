import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { getUser } from '../actions';
import { UserState } from '../reducer';
import userService from '../user/user.service';

function HomeComponent(props: any) {
    const userSelector = (state: UserState) => state.user;
    const user = useSelector(userSelector);
    const dispatch = useDispatch();

    useEffect(() => {
        userService.getUser(user.username).then((user) => {
            dispatch(getUser(user));
        });
    }, []);

    return (
        <div>
            { user.firstName ? (
                <div className='clickable'>
                    <br/>
                    Welcome, {user.firstName} {user.lastName}.
                    <br/>
                    <br/>
                    Available reimbursement: {user.availReimb}
                    <br/>
                    Pending reimbursement: {user.pendReimb}
                    <br/>
                    Awarded reimbursement: {user.awardReimb}
                    <br/>
                    <br/>
                    <Link to='/addReimb'>Create a reimbursement request</Link>
                </div>
            ) : (
                    <div>
                        You are not logged in.
                    </div>
            )}
        </div>
    )
}

export default HomeComponent;