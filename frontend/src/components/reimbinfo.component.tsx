import { SyntheticEvent } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { getReimb, updateReimb } from '../actions';
import { UserState, ReimbState } from '../reducer';
import reimbService from '../reimb/reimb.service';

function ReimbInfoComponent() {
    const selectUser = (state: UserState) => state.user;
    const user = useSelector(selectUser);
    const selectReimb = (state: ReimbState) => state.reimb;
    const reimb = useSelector(selectReimb);
    const dispatch = useDispatch();
    const history = useHistory();
    console.log(JSON.stringify(reimb.approval[0].firstApprover));

    function handleFormInput(e: SyntheticEvent) {
        let r: any = { ...reimb };
        r.approval[0].reasonInfo = ((e.target as HTMLInputElement).value);
        r.approval[0].usernameInfoRequestor = user.username;
        r.approval[0].approved = 'Awaiting info';
        dispatch(updateReimb(r));
    }

    function submitForm() {
        let r: any = { ...reimb }
        r.approval[0].usernameInfoProvider = selectInfoProvider();
        reimbService.updateReimb(r).then(() => {
            dispatch(updateReimb(r));
            history.push('/reimbs');
        });
    }

    function cancel() {
        history.push('/reimbs/' + reimb.idReimb);
    }

    function selectInfoProvider() {
        let selector: string = (document.getElementById('recipientSelect') as HTMLInputElement).value;
        console.log(selector);
        return selector;
    }

    return (
        <div className='form'>
            Choose a recipient:
            <select id="recipientSelect">
                <option value={reimb.usernameRequestor}>{reimb.usernameRequestor}</option>
                {(() => {
                    if (reimb.approval[0].firstApprover != '') {
                        return (
                            <option value={reimb.approval[0].firstApprover}>{reimb.approval[0].firstApprover}</option>
                        );
                    }
                })()}
                {(() => {
                    if (reimb.approval[0].secondApprover != '') {
                        return (
                            <option value={reimb.approval[0].secondApprover}>{reimb.approval[0].secondApprover}</option>
                        );
                    }
                })()}
            </select>
            <br/>
            <br/>
            Reason for information request: <input type='text' className='form-control' onChange={handleFormInput} name='description' />
            <button onClick={submitForm}>Submit</button>
            <button onClick={cancel}>Cancel</button>
        </div>
    )
}

export default ReimbInfoComponent;