import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getAllReimbs } from '../actions';
import { UserState, ReimbState } from '../reducer';
import ReimbComponent from './reimb.component';
import reimbService from '../reimb/reimb.service';

function ReimbListComponent() {
    const selectReimb = (state: ReimbState) => state.reimbs;
    const reimbs = useSelector(selectReimb);
    const userSelector = (state: UserState) => state.user;
    const user = useSelector(userSelector);
    const dispatch: any = useDispatch();
    
    useEffect(() => {
        reimbService.getAllReimbs().then((items) => {
            dispatch(getAllReimbs(items))
        })
    }, [dispatch]);

    return (
        <div>
            <p>
                <p>
                    {(() => {
                        if (reimbs.filter(reimb => reimb.approval[0].reasonAmountChange && reimb.approval[0].usernameInfoProvider === user.username).length > 0) {
                            console.log('');
                            return (
                                <p>Awaiting approval for amount change:</p>
                            )
                        }
                    })()}
                    {reimbs.map((value, index: number) => {
                        if (value.approval[0].reasonAmountChange && value.approval[0].usernameInfoProvider === user.username) {
                            return (
                                <ReimbComponent
                                    key={'reimb-' + index}
                                    data={value}
                                ></ReimbComponent>
                            );
                        } else {
                            return null;
                        }
                    })}
                </p>
                <p>
                    {(() => {
                        if (reimbs.filter(reimb => !(reimb.approval[0].reasonAmountChange) && (reimb.approval[0].usernameInfoProvider === user.username) && (reimb.approval[0].approved === 'Awaiting info')).length > 0) {
                            console.log('');
                            return (
                                <p>Additional information required:</p>
                            )
                        }
                    })()}
                    {reimbs.map((value, index: number) => {
                        if (!(value.approval[0].reasonAmountChange) && (value.approval[0].usernameInfoProvider === user.username) && (value.approval[0].approved === 'Awaiting info')) {
                            return (
                                <ReimbComponent
                                    key={'reimb-' + index}
                                    data={value}
                                ></ReimbComponent>
                            );
                        } else {
                            return null;
                        }
                    })}
                </p>
                <p>
                    {(() => {
                        if (reimbs.filter(reimb => (reimb.usernameRequestor === user.username) && ((reimb.approval[0].approved === 'Pending') || (reimb.approval[0].approved === 'Approved'))).length > 0) {
                            console.log('');
                            return (
                                <p>My Requests:</p>
                            )
                        }
                    })()}
                    {reimbs.map((value, index: number) => {
                        if ((user.username === value.usernameRequestor) && ((value.approval[0].approved === 'Pending') || (value.approval[0].approved === 'Approved'))) {
                            return (
                                <ReimbComponent
                                    key={'reimb-' + index}
                                    data={value}
                                ></ReimbComponent>
                            );
                        } else {
                            return null;
                        }
                    })}
                </p>
                <p>
                    {(() => {
                        if (reimbs.filter(reimb => (reimb.usernameAssigned === user.username) && (reimb.approval[0].approved === 'Pending')).length > 0) {
                            console.log('');
                            return (
                                <p>Assigned to me:</p>
                            )
                        }
                    })()}
                    {reimbs.map((value, index: number) => {
                        if ((user.username === value.usernameAssigned) && (value.approval[0].approved === 'Pending')) {
                            return (
                                <ReimbComponent
                                    key={'reimb-' + index}
                                    data={value}
                                ></ReimbComponent>
                            );
                        } else {
                            return null;
                        }
                    })}
                </p>
                <p>
                    {(() => {
                        if (reimbs.filter(reimb => (reimb.approval[0].approved === 'Cancelled')  && (user.username === reimb.usernameRequestor)).length > 0) {
                            console.log('');
                            return (
                                <p>Cancelled requests:</p>
                            )
                        }
                    })()}
                    {reimbs.map((value, index: number) => {
                        if ((value.approval[0].approved === 'Cancelled')  && (user.username === value.usernameRequestor)) {
                            return (
                                <ReimbComponent
                                    key={'reimb-' + index}
                                    data={value}
                                ></ReimbComponent>
                            );
                        } else {
                            return null;
                        }
                    })}
                </p>
                <p>
                    {(() => {
                        if (reimbs.filter(reimb => (reimb.approval[0].approved === 'Denied')  && (user.username === reimb.usernameRequestor)).length > 0) {
                            console.log('');
                            return (
                                <p>Denied requests:</p>
                            )
                        }
                    })()}
                    {reimbs.map((value, index: number) => {
                        if ((value.approval[0].approved === 'Denied')  && (user.username === value.usernameRequestor)) {
                            return (
                                <ReimbComponent
                                    key={'reimb-' + index}
                                    data={value}
                                ></ReimbComponent>
                            );
                        } else {
                            return null;
                        }
                    })}
                </p>
                <p>
                    {(() => {
                        if (reimbs.filter(reimb => (reimb.approval[0].approved === 'Approved')  && (user.username === reimb.usernameAssigned)).length > 0) {
                            console.log('');
                            return (
                                <p>Awaiting award confirmation:</p>
                            )
                        }
                    })()}
                    {reimbs.map((value, index: number) => {
                        if ((value.approval[0].approved === 'Approved')  && (user.username === value.usernameAssigned)) {
                            return (
                                <ReimbComponent
                                    key={'reimb-' + index}
                                    data={value}
                                ></ReimbComponent>
                            );
                        } else {
                            return null;
                        }
                    })}
                </p>
                <p>
                    {(() => {
                        if (reimbs.filter(reimb => ((reimb.approval[0].approved === 'Reimbursement awarded') || (reimb.approval[0].approved === 'Requirements not met'))  && (user.username === reimb.usernameRequestor)).length > 0) {
                            console.log('');
                            return (
                                <p>Completed requests:</p>
                            )
                        }
                    })()}
                    {reimbs.map((value, index: number) => {
                        if (((value.approval[0].approved === 'Reimbursement awarded') || (value.approval[0].approved === 'Requirements not met'))  && (user.username === value.usernameRequestor)) {
                            return (
                                <ReimbComponent
                                    key={'reimb-' + index}
                                    data={value}
                                ></ReimbComponent>
                            );
                        } else {
                            return null;
                        }
                    })}
                </p>
            </p>
        </div>
    )
}

export default ReimbListComponent;