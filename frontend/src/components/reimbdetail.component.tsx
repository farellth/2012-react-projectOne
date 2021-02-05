import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { getReimb, getTargetUser, updateUser, updateReimb } from '../actions';
import { UserState, ReimbState } from '../reducer';
import userService from '../user/user.service'
import reimbService from '../reimb/reimb.service';

interface ReimbDetailProps {
    match: any;
}

function ReimbDetailComponent(props: ReimbDetailProps) {
    const selectUser = (state: UserState) => state.user;
    const user = useSelector(selectUser);
    const selectTargetUser = (state: UserState) => state.targetUser;
    const targetUser = useSelector(selectTargetUser);
    const selectReimb = (state: ReimbState) => state.reimb;
    const reimb = useSelector(selectReimb);
    const dispatch = useDispatch();
    const history = useHistory();
    console.log('User logged in at detail screen: ' + JSON.stringify(user));
    console.log('Initial target user: ' + JSON.stringify(targetUser));
    console.log('Inital reimb in detail screen: ' + JSON.stringify(reimb));

    useEffect(() => {
        reimbService.getReimb(props.match.params.id).then((reimb) => {
            dispatch(getReimb(reimb));
            console.log('ReimbDetail reimb useEffect: ' + JSON.stringify(reimb));
        });
        userService.getUser(reimb.usernameRequestor).then((user) => {
            dispatch(getTargetUser(user));
            console.log('ReimbDetail targetUser useEffect: ' + JSON.stringify(user));
        });
    }, []);

    useEffect(() => {
        reimbService.getReimb(props.match.params.id).then((reimb) => {
            dispatch(getReimb(reimb));
        });
    }, [dispatch, props.match.params.id]);

    function approve() {
        let r: any = { ...reimb };
        if (r.approval[0].reasonInfo) {
            r.approval[0].reasonInfo = null;
            r.approval[0].reasonAmountChange = null;
        }
        if (user.role === 'HR') {
            let u: any = { ...targetUser };
            u.availReimb = u.availReimb - r.approval[0].approvedAmount;
            u.pendReimb = u.pendReimb + r.approval[0].approvedAmount;
            userService.updateUser(u).then(() => {
                console.log('Updating user: ' + JSON.stringify(u));
                dispatch(updateUser(u));
            });
            r.approval[0].approved = 'Approved';
            if ((r.course[0].gradingFormat != 'Presentation') || (u.role === 'Manager') || (u.role === 'HR')) {
                r.usernameAssigned = 'hr2';
            } else {
                r.usernameAssigned = u.usernameSuper;
            }
        } else if (user.role === 'Supervisor') {
            r.approval[0].firstApprover = user.username;
            r.usernameAssigned = user.usernameSuper;
        } else {
            r.approval[0].secondApprover = user.username;
            r.usernameAssigned = 'hr1';
        }
        reimbService.updateReimb(r).then(() => {
            dispatch(updateReimb(r));
            history.push('/reimbs');
        });
    }

    function toReject() {
        history.push('/reimbs/' + reimb.idReimb + '/denial');
    }

    function toInfoReq() {
        history.push('/reimbs/' + reimb.idReimb + '/info');
    }

    function toEdit() {
        history.push('/reimbs/' + reimb.idReimb + '/edit');
    }

    function acceptChange() {
        let r: any = { ...reimb };
        r.approval[0].usernameInfoProvider = null;
        r.approval[0].usernameInfoRequestor = null;
        r.approval[0].approved = 'Pending';
        r.approval[0].reasonAmountChange = null;
        console.log('Resubmitting reimbursement: ' + JSON.stringify(reimb));
        reimbService.updateReimb(r).then(() => {
            dispatch(updateReimb(r));
            history.push('/reimbs');
        });
    }

    function declineChange() {
        let r: any = { ...reimb };
        r.approval[0].approved = 'Cancelled';
        r.approval[0].reasonAmountChange = null;
        r.usernameAssigned = null;
        console.log('Resubmitting reimbursement: ' + JSON.stringify(reimb));
        reimbService.updateReimb(r).then(() => {
            dispatch(updateReimb(r));
            history.push('/reimbs');
        });
    }

    function cancelRequest() {
        history.push('/reimbs/' + reimb.idReimb + '/denial');
    }

    function coursePassed() {
        let pass: boolean = true;
        courseComplete(pass);
    }

    function courseFailed() {
        let pass: boolean = false;
        courseComplete(pass);
    }

    function courseComplete(pass: boolean) {
        let u: any = { ...targetUser };
        let r: any = { ...reimb };
        r.usernameAssigned = '';
        if (pass === true) {
            u.pendReimb = u.pendReimb - r.approval[0].approvedAmount;
            u.awardReimb = u.awardReimb + r.approval[0].approvedAmount;
            r.approval[0].approved = 'Reimbursement awarded';
        } else {
            u.pendReimb = u.pendReimb - r.approval[0].approvedAmount;
            u.availReimb = u.availReimb + r.approval[0].approvedAmount;
            r.approval[0].approved = 'Requirements not met'
        }
        userService.updateUser(u).then(() => {
            console.log('Updating user: ' + u);
            dispatch(updateUser(u));
        });
        reimbService.updateReimb(r).then(() => {
            console.log('Closing out reimbursement: ' + r);
            dispatch(updateReimb(r));
            history.push('/reimbs');
        });
    }

    return (
        <div>
            {reimb.usernameRequestor ? (
                <div>
                    <p>Reimbursement details:
                        <ul>
                            <li>{'ID: ' + reimb.idReimb}</li>
                            <li>{'Requestor: ' + reimb.usernameRequestor}</li>
                            <li>{reimb.requestorDetails[0].firstName}</li>
                            <li>{reimb.requestorDetails[0].lastName}</li>
                            <li>{'Assigned to: ' + reimb.usernameAssigned}</li>
                            <li>{'Reimbursement amount: $' + reimb.approval[0].approvedAmount}</li>
                            <li>{'Status: ' + reimb.approval[0].approved}</li>
                            {(() => {
                                if (reimb.course[0].comments) {
                                    return (
                                        <>
                                            <br/>
                                            <li>{'Comments: ' + reimb.course[0].comments}</li>
                                        </>
                                    );
                                }
                            })()}
                            {(() => {
                                if (reimb.approval[0].reasonDeclined) {
                                    return (
                                        <>
                                            <br/>
                                            <li>{'Reason for denial: ' + reimb.approval[0].reasonDeclined}</li>
                                        </>
                                    );
                                }
                            })()}
                            {(() => {
                                if (reimb.approval[0].reasonInfo) {
                                    return (
                                        <>
                                            <br/>
                                            <li>{'Reason for information request: ' + reimb.approval[0].reasonInfo}</li>
                                        </>
                                    );
                                }
                            })()}
                            {(() => {
                                if (reimb.approval[0].reasonAmountChange) {
                                    return (
                                        <>
                                            <br/>
                                            <li>{'Reason for amount change: ' + reimb.approval[0].reasonAmountChange}</li>
                                        </>
                                    );
                                }
                            })()}
                        </ul>
                    </p>
                    <p>Course details:
                        <ul>
                            <li>{'Description of course: ' + reimb.course[0].description}</li>
                            <li>{'Type of course: ' + reimb.course[0].courseType}</li>
                            <li>{'Date: ' + reimb.course[0].date}</li>
                            <li>{'Time: ' + reimb.course[0].time}</li>
                            <li>{'Location: ' + reimb.course[0].location}</li>
                            <li>{'Total cost: $' + reimb.course[0].amount}</li>
                            <li>{'Grading format: ' + reimb.course[0].gradingFormat}</li>
                            {(() => {
                                if (reimb.approval[0].grade) {
                                    return (
                                        <li>{'Grade received: ' + reimb.approval[0].grade}</li>
                                    )
                                }
                            })()}
                            {(() => {
                                if (reimb.course[0].gradingFormat === 'A-F') {
                                    return (
                                        <li>{'Minimum passing grade: ' + reimb.course[0].passingGrade}</li>
                                    )
                                }
                            })()}
                            <li>{'Business justification: ' + reimb.course[0].justification}</li>
                        </ul>
                    </p>
                    { (reimb.usernameAssigned === user.username) && ((reimb.approval[0].approved === 'Pending') || (reimb.approval[0].approved === 'Awaiting info')) ? (
                        <div>
                            <button onClick={approve}>Approve</button>
                            <br />
                            <button onClick={toReject}>Deny</button>
                            <br />
                            <button onClick={toInfoReq}>Request more information</button>
                            <br/>
                        </div>
                    ) : (
                        null
                    )}
                    {(() => {
                        if ((reimb.approval[0].usernameInfoProvider === user.username || user.role === 'HR') && !(reimb.approval[0].reasonAmountChange)) {
                            return (
                                <p>
                                    <button onClick={toEdit}>Modify</button>
                                </p>
                            )
                        }
                    })()}
                    {(() => {
                        if (reimb.approval[0].reasonAmountChange && user.username === reimb.usernameRequestor) {
                            return (
                                <p>
                                    <button onClick={acceptChange}>Accept change</button>
                                    <button onClick={declineChange}>Decline change</button>
                                </p>
                            )
                        }
                    })()}
                    {(() => {
                        if ((user.username === reimb.usernameRequestor) && !((reimb.approval[0].approved === 'Cancelled') || (reimb.approval[0].approved === 'Denied') || (reimb.approval[0].approved === 'Reimbursement awarded') || (reimb.approval[0].approved === 'Requirements not met'))) {
                            return (
                                <p>
                                    <button onClick={cancelRequest}>Cancel request</button>
                                </p>
                            )
                        }
                    })()}
                    {(() => {
                        if ((user.username === reimb.usernameAssigned) && (reimb.approval[0].approved === 'Approved')) {
                            return (
                                <p>
                                    Reimbursement requirements fulfilled?
                                    <button onClick={coursePassed}>Yes</button>
                                    <button onClick={courseFailed}>No</button>
                                </p>
                            )
                        }
                    })()}
                    {(() => {
                        if ((user.username === reimb.usernameRequestor) && (reimb.approval[0].approved === 'Approved') && !(reimb.approval[0].grade)) {
                            return (
                                <p>
                                    <button onClick={toEdit}>Upload grade</button>
                                </p>
                            )
                        }
                    })()}
                </div>
            ) : <div>
                Loading...
            </div>
            }
        </div>
    )
}

export default ReimbDetailComponent;