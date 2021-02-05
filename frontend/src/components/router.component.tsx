import React from 'react';
import { Route, BrowserRouter, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { UserState } from '../reducer';
import LoginComponent from './login.component';
import HomeComponent from './home.component';
import ReimbListComponent from './reimblist.component';
import ReimbDetailComponent from './reimbdetail.component';
import ReimbDenialComponent from './reimbdenial.component';
import ReimbInfoComponent from './reimbinfo.component';
import ReimbEditComponent from './reimbedit.component';
import AddReimbComponent from './reimbadd.component';

export default function RouterComponent() {
    const userSelector = (state: UserState) => state.user;
    const user = useSelector(userSelector);
    const dispatch = useDispatch();

    return (
        <BrowserRouter>
            <div>
                <header className="App-header">
                    <p>
                        Tuition Reimbursement Management System
                    </p>
                    <nav id='nav'>
                        <ul>
                            <li>
                                {user.firstName ? (
                                    <Link to='/login'>Logout</Link>
                                ) : (
                                        <Link to='/login'>Login</Link>
                                    )}
                            </li>

                            <li>
                                <Link to='/home'>Home</Link>
                            </li>
                            {user.firstName ? (
                                <li>
                                    <Link to='/reimbs'>Reimbursements</Link>
                                </li>
                            ) : null}
                        </ul>
                    </nav>
                </header>
                <Route path='/login' component={LoginComponent} />
                <Route path='/home' component={HomeComponent} />
                <Route exact path='/reimbs' component={ReimbListComponent} />
                <Route exact path='/reimbs/:id' component={ReimbDetailComponent} />
                <Route exact path='/reimbs/:id/denial' component={ReimbDenialComponent} />
                <Route exact path='/reimbs/:id/info' component={ReimbInfoComponent} />
                <Route exact path='/reimbs/:id/edit' component={ReimbEditComponent} />
                <Route exact path='/addReimb' component={AddReimbComponent} />
            </div>
        </BrowserRouter>
    )
}