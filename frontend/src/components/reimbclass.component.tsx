import React from 'react';
import { Reimb } from '../reimb/reimb';

import reimbService from '../reimb/reimb.service';

interface RProps {
    which: number;
}
interface RState {
    data: Reimb[];
}
class ReimbClassComponent extends React.Component<RProps, RState> {
    
    constructor(props: any) {
        super(props);
        console.log('Mounting: Constructor!');
        this.state = {data: []};
    }

    componentDidMount() {
        console.log('Mounted Component');
        reimbService.getAllReimbs().then((data) => {
            console.log(data);
            // Looks at the new state and the old state, if they are different objects (== comparison), then update.
            this.setState({data: data});
        });
    }

    componentWillUnmount(){
        console.log('Component is removed from dom.');
    }

    shouldComponentUpdate(){
        console.log('If this returns false, it will not update');
        return true;
    }

    componentDidUpdate() {
        console.log('updated Component');
    }

    render() {
        console.log('render');
        return (
            <div>
            <h1>Reimbursement</h1>
            <p>{this.state.data.length ? this.state.data[this.props.which].idReimb: ''}</p>
            </div>
        );
    }
}

export default ReimbClassComponent;