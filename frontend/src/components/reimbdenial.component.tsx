import { SyntheticEvent } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { updateUser, updateReimb } from '../actions';
import { UserState, ReimbState } from '../reducer';
import userService from '../user/user.service';
import reimbService from '../reimb/reimb.service';

function ReimbDenialComponent() {
    const selectUser = (state: UserState) => state.user;
    const user = useSelector(selectUser);
    const selectTargetUser = (state: UserState) => state.targetUser;
    const targetUser = useSelector(selectTargetUser);
    const selectReimb = (state: ReimbState) => state.reimb;
    const reimb = useSelector(selectReimb);
    const dispatch = useDispatch();
    const history = useHistory();

    function handleDenialFormInput(e: SyntheticEvent) {
        let r: any = { ...reimb };
        r.approval[0].reasonDeclined = ((e.target as HTMLInputElement).value);
        if (r.approval[0].reasonInfo) {
            r.approval[0].reasonInfo = null;
        }
        dispatch(updateReimb(r));
    }

    function submitForm() {
        let r: any = { ...reimb };
        r.usernameAssigned = null;
        r.approval[0].approved = 'Denied';
        console.log('Rejecting reimbursement: ' + JSON.stringify(r));
        reimbService.updateReimb(r).then(() => {
            dispatch(updateReimb(r));
            history.push('/reimbs');
        });
    }

    function cancel() {
        history.push('/reimbs/' + reimb.idReimb);
    }

    function sumbitCancel() {
        let u: any = { ...targetUser };
        let r: any = { ...reimb };
        if (r.approval[0].approved === 'Approved') {
            u.pendReimb = u.pendReimb - r.approval[0].approvedAmount;
            u.availReimb = u.availReimb + r.approval[0].approvedAmount;
        }
        r.approval[0].approved = 'Cancelled';
        r.approval[0].reasonAmountChange = null;
        r.usernameAssigned = null;
        console.log('Resubmitting reimbursement: ' + JSON.stringify(reimb));
        userService.updateUser(u).then(() => {
            console.log('Updating user: ' + u);
            dispatch(updateUser(u));
        });
        reimbService.updateReimb(r).then(() => {
            dispatch(updateReimb(r));
            history.push('/reimbs');
        });
    }

    return (
        <div className='formContainer'>
            <div className='form'>
                {(() => {
                    if (user.username === reimb.usernameAssigned) {
                        return (
                            <p className='form'>
                                Reason for denial: <input type='text' className='form-control' onChange={handleDenialFormInput} name='description'/>
                                <button onClick={submitForm}>Submit</button>
                                <button onClick={cancel}>Cancel</button>
                            </p>
                        );
                    }
                })()}
                {(() => {
                    if (user.username === reimb.usernameRequestor) {
                        return (
                            <p className='form'>
                                Are you sure you want to cancel this reimbursement request?
                                <br/>
                                <button onClick={sumbitCancel}>Yes</button>
                                <button onClick={cancel}>No</button>
                            </p>
                        );
                    }
                })()}
            </div>
        </div>
    )
}

export default ReimbDenialComponent;