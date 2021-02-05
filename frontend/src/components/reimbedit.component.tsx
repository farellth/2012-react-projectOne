import { SyntheticEvent } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { updateReimb } from '../actions';
import { UserState, ReimbState } from '../reducer';
import { calReimbAmount } from '../numToolKit';
import reimbService from '../reimb/reimb.service';

function ReimbEditComponent() {
    const selectUser = (state: UserState) => state.user;
    const user = useSelector(selectUser);
    const selectReimb = (state: ReimbState) => state.reimb;
    const reimb = useSelector(selectReimb);
    const dispatch = useDispatch();
    const history = useHistory();
    
    function handleFormInput(e: SyntheticEvent) {
        let r: any = { ...reimb };
        switch ((e.target as HTMLInputElement).name) {
            case 'description':
                r.course[0].description = ((e.target as HTMLInputElement).value);
                break;
            case 'date':
                r.course[0].date = (e.target as HTMLInputElement).value;
                break;
            case 'time':
                r.course[0].time = (e.target as HTMLInputElement).value;
                break;
            case 'location':
                r.course[0].location = (e.target as HTMLInputElement).value;
                break;
            case 'amount':
                r.course[0].amount = Number((e.target as HTMLInputElement).value);
                break;
            case 'gradingFormat':
                r.course[0].gradingFormat = (e.target as HTMLInputElement).value;
                break;
            case 'justification':
                r.course[0].justification = (e.target as HTMLInputElement).value;
                break;
            case 'comments':
                r.course[0].comments = (e.target as HTMLInputElement).value;
                break;
            case 'approvedAmount':
                r.approval[0].approvedAmount = Number((e.target as HTMLInputElement).value);
                break;
            case 'reasonAmountChange':
                r.approval[0].reasonAmountChange = (e.target as HTMLInputElement).value;
                break;
        }
        if (user.username === reimb.usernameRequestor) {
            r.course[0].courseType = selectCourseType();
            r.course[0].gradingFormat = selectGradingFormat();
            if (r.course[0].gradingFormat === 'A-F') {
                r.course[0].passingGrade = selectMinGrade();
            } else {
                r.course[0].passingGrade = '';
            }
        }
        if (user.username === r.usernameRequestor) {
            r.approval[0].approvedAmount = Number(calReimbAmount(r.course[0].amount, r.course[0].courseType));
        }
        dispatch(updateReimb(r));
    }

    function resubmitForm() {
        let r: any = { ...reimb };
        r.approval[0].usernameInfoProvider = null;
        r.approval[0].usernameInfoRequestor = null;
        r.approval[0].approved = 'Pending';
        r.approval[0].approvedAmount = calReimbAmount(r.course[0].amount, r.course[0].courseType);
        console.log('Resubmitting reimbursement: ' + JSON.stringify(r));
        reimbService.updateReimb(r).then(() => {
            dispatch(updateReimb(r));
            history.push('/reimbs');
        });
    }

    function submitForm() {
        let r: any = { ...reimb };
        r.course[0].courseType = selectCourseType();
        r.course[0].gradingFormat = selectGradingFormat();
        if (r.course[0].gradingFormat === 'A-F') {
            r.course[0].passingGrade = selectMinGrade();
        } else {
            r.course[0].passingGrade = '';
        }
        r.approval[0].approved = 'Pending';
        r.approval[0].approvedAmount = calReimbAmount(r.course[0].amount, r.course[0].courseType);
        console.log('Submitting reimbursement: ' + JSON.stringify(r));
        reimbService.updateReimb(r).then(() => {
            dispatch(updateReimb(r));
            history.push('/reimbs');
        });
    }

    function submitAmount() {
        let r: any = { ...reimb }
        r.approval[0].usernameInfoRequestor = user.username;
        r.approval[0].usernameInfoProvider = r.usernameRequestor;
        r.approval[0].approved = 'Awaiting info';
        console.log('Submitting reimbursement: ' + JSON.stringify(r));
        reimbService.updateReimb(r).then(() => {
            dispatch(updateReimb(r));
            history.push('/reimbs');
        });
    }

    function submitGrade() {
        let r: any = { ...reimb }
        r.approval[0].grade = selectGrade();
        console.log('Submitting reimbursement with grade: ' + JSON.stringify(r));
        reimbService.updateReimb(r).then(() => {
            dispatch(updateReimb(r));
            history.push('/reimbs');
        });
    }

    function cancel() {
        history.push('/reimbs/' + reimb.idReimb);
    }

    function selectCourseType() {
        let selector: string = (document.getElementById('courseSelect') as HTMLInputElement).value;
        console.log(selector);
        return selector;
    }

    function selectGradingFormat() {
        let selector: string = (document.getElementById('gradingFormatSelect') as HTMLInputElement).value;
        return selector;
    }

    function selectMinGrade() {
        if (document.getElementById('minGradeSelect') as HTMLInputElement) {
            let selector: string = (document.getElementById('minGradeSelect') as HTMLInputElement).value;
            return selector;
        } else {
            return '';
        }
    }

    function selectGrade() {
        let selector: string = (document.getElementById('selectGrade') as HTMLInputElement).value;
        return selector;
    }

    return (
        <div className = 'formContainer'>
            {(() => {
                if (user.username === reimb.approval[0].usernameInfoProvider) {
                    return (
                        <p className = 'form'>
                            {(() => {
                                if (reimb.approval[0].usernameInfoProvider && reimb.approval[0].usernameInfoProvider === user.username) {
                                    return (
                                        <p>
                                            Reason for information request: {reimb.approval[0].reasonInfo}
                                            <br/>
                                        </p>
                                    )
                                }
                            })()}
                            Course description: <input type='text' className='form-control' value={reimb.course[0].description} onChange={handleFormInput} name='description'/>
                            <br/>
                            Course type:
                            <select id="courseSelect">
                                <option value='Uni'>80% - University-level course</option>
                                <option value='Sem'>60% - Seminar</option>
                                <option value='CertPrep'>75%  - Certification Preparation</option>
                                <option value='Cert'>100% - Certification</option>
                                <option value='Tech'>90% - Technical Training</option>
                                <option value='Other'>30% - Other</option>
                            </select>
                            <br/>
                            Date(s): <input type='text' className='form-control' value={reimb.course[0].date} onChange={handleFormInput} name='date'/>
                            <br/>
                            Time: <input type='text' className='form-control' value={reimb.course[0].time} onChange={handleFormInput} name='time'/>
                            <br/>
                            Location: <input type='text' className='form-control' value={reimb.course[0].location} onChange={handleFormInput} name='location'/>
                            <br/>
                            Total cost of course: <input type='text' className='form-control' value={reimb.course[0].amount} onChange={handleFormInput} name='amount'/>
                            <br/>
                            Projected reimbursement: {reimb.approval[0].approvedAmount}
                            <br/>
                            Grading format:
                            <select id='gradingFormatSelect'>
                                <option value='A-F'>A-F</option>
                                <option value='Pass/Fail'>Pass/Fail</option>
                                <option value='Complete/Incomplete'>Complete/Incomplete</option>
                                <option value='Presentation'>Presentation</option>
                            </select>
                            <br/>
                            Minimum passing grade:
                            <select id='minGradeSelect'>
                                <option value='N/A'>N/A</option>
                                <option value='A'>A</option>
                                <option value='B'>B</option>
                                <option value='C'>C</option>
                                <option value='D'>D</option>
                            </select>
                            <br/>
                            Business justification: <input type='text' className='form-control' value={reimb.course[0].justification} onChange={handleFormInput} name='justification'/>
                            <br/>
                            Comments: <input type='text' className='form-control' value={reimb.course[0].comments} onChange={handleFormInput} name='comments'/>
                            {(() => {
                                if (reimb.approval[0].usernameInfoProvider && reimb.approval[0].usernameInfoProvider === user.username) {
                                    return (<button className='formButton' onClick={resubmitForm}>Resubmit</button>)
                                } else {
                                    return (<button className='formButton' onClick={submitForm}>Submit</button>)
                                }
                            })()}
                            <button onClick={cancel}>Cancel</button>
                        </p>
                        )
                    }
            })()}
            {(() => {
                if (user.role === 'HR') {
                    return (
                        <p className='form'>
                            Reimbursement amount: <input type='text' className='form-control' value={reimb.approval[0].approvedAmount} onChange={handleFormInput} name='approvedAmount'/>
                            <br/>
                            Reason for change in amount: <input type='text' className='form-control' value={reimb.approval[0].reasonAmountChange} onChange={handleFormInput} name='reasonAmountChange'/>
                            <button className='formButton' onClick={submitAmount}>Submit</button>
                            <button onClick={cancel}>Cancel</button>
                        </p>
                    )
                }
            })()}
            {(() => {
                        if ((user.username === reimb.usernameRequestor) && (reimb.approval[0].approved === 'Approved')) {
                            return (
                                <p>
                                    Upload grade
                                    {(() => {
                                        if (reimb.course[0].gradingFormat === 'A-F')
                                            return (
                                                <p>
                                                    <select id='selectGrade'>
                                                        <option value='A'>A</option>
                                                        <option value='B'>B</option>
                                                        <option value='C'>C</option>
                                                        <option value='D'>D</option>
                                                        <option value='F'>F</option>
                                                    </select>
                                                </p>
                                            )
                                    })()}
                                    {(() => {
                                        if (reimb.course[0].gradingFormat === 'Pass/Fail')
                                            return (
                                                <p>
                                                    <select id='selectGrade'>
                                                        <option value='Pass'>Pass</option>
                                                        <option value='Fail'>Fail</option>
                                                    </select>
                                                </p>
                                            )
                                    })()}
                                    {(() => {
                                        if (reimb.course[0].gradingFormat === 'Complete/Incomplete')
                                            return (
                                                <p>
                                                    <select id='selectGrade'>
                                                        <option value='Complete'>Complete</option>
                                                        <option value='Incomplete'>Incomplete</option>
                                                    </select>
                                                </p>
                                            )
                                    })()}
                                    <button onClick={submitGrade}>Submit</button>
                                    <button onClick={cancel}>Cancel</button>
                                </p>
                            )
                        }
                    })()}
        </div>
    )
}

export default ReimbEditComponent;