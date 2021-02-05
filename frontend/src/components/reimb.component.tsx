import { Link } from 'react-router-dom';

import { Reimb } from '../reimb/reimb';

interface ReimbProps {
    data: Reimb;
}

function ReimbComponent(props: ReimbProps) {
    return (
        <div>
            <p className='clickable'>
                {'ID: '}
                <Link to = {`/reimbs/${props.data.idReimb}`}>
                    {props.data.idReimb}
                </Link>
                {
                    ' Username: ' + props.data.usernameRequestor + 
                    ' Name: ' + props.data.requestorDetails[0].firstName + ' ' +  props.data.requestorDetails[0].lastName +
                    ' Amount: $' + props.data.approval[0].approvedAmount + 
                    ' Status: ' + props.data.approval[0].approved
                }
            </p>
            <br/>
        </div>
    );
}

export default ReimbComponent;