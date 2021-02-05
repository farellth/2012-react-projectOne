import { SyntheticEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { getReimb, updateReimb } from '../actions';
import { UserState, ReimbState } from '../reducer';
import reimbService from '../reimb/reimb.service';
import { calReimbAmount, idGen } from '../numToolKit';

function AddReimbComponent() {
    const selectUser = (state: UserState) => state.user;
    const user = useSelector(selectUser);
    const selectReimb = (state: ReimbState) => state.reimb;
    const reimb = useSelector(selectReimb);
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        let r: any = { ...reimb }
        console.log(JSON.stringify(r))
        r.course.push({description: ''});
        console.log(JSON.stringify(r))
        r.course[0].courseType = '';
        r.course[0].date = '';
        r.course[0].time = '';
        r.course[0].location = '';
        r.course[0].amount = '';
        r.course[0].gradingFormat = '';
        r.course[0].justification = '';
        r.course[0].comments = '';
        console.log(JSON.stringify(r))
        r.approval.push({firstApprover: ''});
        r.approval[0].secondApprover = '';
        r.approval[0].approved = '';
        r.approval[0].approvedAmount = 0;
        r.approval[0].reasonDeclined = '';
        r.approval[0].reasonInfo = '';
        r.approval[0].usernameInfoRequestor= '';
        r.approval[0].usernameInfoProvider = '';
        r.approval[0].reasonAmountChange = '';
        r.approval[0].grade = '';
        r.approval[0].completed = '';
        console.log('Add Reimb useEffect' + JSON.stringify(r));
        dispatch(getReimb(r));
    }, []);

    useEffect(() => {
        dispatch(getReimb(reimb));
    }, [dispatch]);

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
        }
        r.idReimb = idGen(6);
        r.usernameRequestor = user.username;
        if (user.usernameSuper) {
            r.usernameAssigned = user.usernameSuper;
        } else if ((user.role === 'Manager') || (user.role === 'HR')){
            r.usernameAssigned = 'hr2';
        } else if (user.username === 'hr2') {
            r.usernameAssigned = 'hr1';
        }
        r.requestorDetails = [{ firstName: user.firstName, lastName: user.lastName }];
        r.course[0].courseType = selectCourseType();
        r.course[0].gradingFormat = selectGradingFormat();
        if (r.course[0].gradingFormat === 'A-F') {
            r.course[0].passingGrade = selectMinGrade();
        } else {
            r.course[0].passingGrade = '';
        }
        r.approval[0].approvedAmount = Number(calReimbAmount(r.course[0].amount, r.course[0].courseType));
        console.log('running handleFormInput')
        dispatch(updateReimb(r));
    }

    function submitForm() {
        let r = { ...reimb };
        r.course[0].courseType = selectCourseType();
        r.course[0].gradingFormat = selectGradingFormat();
        if (r.course[0].gradingFormat === 'A-F') {
            r.course[0].passingGrade = selectMinGrade();
        } else {
            r.course[0].passingGrade = '';
        }
        r.approval[0].approved = 'Pending'
        r.approval[0].approvedAmount = Number(calReimbAmount(r.course[0].amount, r.course[0].courseType));
        console.log('Submitting reimbursement: ' + JSON.stringify(r));
        reimbService.addReimb(r).then(() => {
            dispatch(updateReimb(r));
            history.push('/home');
        });
    }

    function cancel() {
        history.push('/home');
    }

    function selectCourseType() {
        let selector: string = (document.getElementById('courseSelect') as HTMLInputElement).value;
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

    return (
        <div className='formContainer'>
            {(() => {
                if (reimb.approval[0]) {
                    return (
                        <p className='form'>
                            Course description: <input type='text' className='formLarge' onChange={handleFormInput} name='description' />
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
                            Date(s): <input type='text' className='form-control' onChange={handleFormInput} name='date' />
                            <br/>
                            Time: <input type='text' className='form-control' onChange={handleFormInput} name='time' />
                            <br/>
                            Location: <input type='text' className='form-control' onChange={handleFormInput} name='location' />
                            <br/>
                            Total cost of course: <input type='text' className='form-control' onChange={handleFormInput} name='amount' />
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
                            Business justification: <input type='text' className='formLarge' onChange={handleFormInput} name='justification' />
                            <br/>
                            <button className='formButton' onClick={submitForm}>Submit reimbursement request</button>
                            <button onClick={cancel}>Cancel</button>
                        </p>
                    )
                } else {
                    return (
                        <p>
                            Loading...
                        </p>
                    )
                }
            })()}
        </div>
    )
}

export default AddReimbComponent;