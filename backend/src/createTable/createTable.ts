import * as AWS from 'aws-sdk';

import { calReimbAmount } from '../numToolKit';
import userService from '../user/user.service';
import reimbService from '../reimb/reimb.service';

AWS.config.update({ region: 'us-east-1' });

const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

const removeUsers = {
    TableName: 'users'
}
const removeReimbs = {
    TableName: 'reimbursements'
}

const userSchema = {
    AttributeDefinitions: [
        {
            AttributeName: 'username',
            AttributeType: 'S'
        }
    ],
    KeySchema: [
        {
            AttributeName: 'username',
            KeyType: 'HASH'
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    },
    TableName: 'users',
    StreamSpecification: {
        StreamEnabled: false
    }
};

const reimbSchema = {
    AttributeDefinitions: [
        {
            AttributeName: 'idReimb',
            AttributeType: 'S'
        }
    ],
    KeySchema: [
        {
            AttributeName: 'idReimb',
            KeyType: 'HASH'
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    },
    TableName: 'reimbursements',
    StreamSpecification: {
        StreamEnabled: false
    }
};

ddb.deleteTable(removeUsers, function (err, data) {
    if (err) {
        console.error('Unable to delete table. Error JSON:', JSON.stringify(err, null, 2));
    } else {
        console.log('Deleted table. Table description JSON:', JSON.stringify(data, null, 2));
    }
    setTimeout(()=>{
        ddb.createTable(userSchema, (err, data) => {
            if (err) {
                // log the error
                console.log('Error', err);
            } else {
                // celebrate, I guess
                console.log('Table Created', data);
                setTimeout(()=>{
                    populateUserTable();
                }, 10000);
            }
        });
    }, 10000);
});

function populateUserTable() {
    userService.addUser({username: 'emp1', password: 'pass', usernameSuper: 'sup1', firstName: 'Joe', lastName: 'Employee', role: 'Employee', availReimb: 1000, pendReimb: 0, awardReimb: 0}).then(()=>{});
    userService.addUser({username: 'emp2', password: 'pass', usernameSuper: 'sup1', firstName: 'Susan', lastName: 'Employee', role: 'Employee', availReimb: 1000, pendReimb: 0, awardReimb: 0}).then(()=>{});
    userService.addUser({username: 'emp3', password: 'pass', usernameSuper: 'sup2', firstName: 'Trevor', lastName: 'Employee', role: 'Employee', availReimb: 1000, pendReimb: 0, awardReimb: 0}).then(()=>{});
    userService.addUser({username: 'emp4', password: 'pass', usernameSuper: 'sup2', firstName: 'Amelia', lastName: 'Employee', role: 'Employee', availReimb: 1000, pendReimb: 0, awardReimb: 0}).then(()=>{});
    userService.addUser({username: 'sup1', password: 'pass', usernameSuper: 'mgr1', firstName: 'Wanda', lastName: 'Supervisor', role: 'Supervisor', availReimb: 1000, pendReimb: 0, awardReimb: 0}).then(()=>{});
    userService.addUser({username: 'sup2', password: 'pass', usernameSuper: 'mgr1', firstName: 'Scott', lastName: 'Supervisor', role: 'Supervisor', availReimb: 1000, pendReimb: 0, awardReimb: 0}).then(()=>{});
    userService.addUser({username: 'mgr1', password: 'pass', firstName: 'Jane', lastName: 'Manager', role: 'Manager', availReimb: 1000, pendReimb: 0, awardReimb: 0}).then(()=>{});
    userService.addUser({username: 'hr1', password: 'pass', firstName: 'David', lastName: 'HR', role: 'HR', availReimb: 1000, pendReimb: 0, awardReimb: 0}).then(() => {});
    userService.addUser({username: 'hr2', password: 'pass', firstName: 'Jennifer', lastName: 'HR', role: 'HR', availReimb: 1000, pendReimb: 0, awardReimb: 0}).then(() => {});
}

ddb.deleteTable(removeReimbs, function (err, data) {
    if (err) {
        console.error('Unable to delete table. Error JSON:', JSON.stringify(err, null, 2));
    } else {
        console.log('Deleted table. Table description JSON:', JSON.stringify(data, null, 2));
    }
    setTimeout(()=>{
        ddb.createTable(reimbSchema, (err, data) => {
            if (err) {
                // log the error
                console.log('Error', err);
            } else {
                // celebrate, I guess
                console.log('Table Created', data);
                setTimeout(()=>{
                    populateReimbTable();
                }, 10000);
            }
        });
    }, 10000);
});

function populateReimbTable() {
    reimbService.addReimb({idReimb: '111111', usernameRequestor: 'emp1', requestorDetails: [{firstName: 'Joe', lastName: 'Employee'}], usernameAssigned: 'sup1', course: [{description: 'Computer class', courseType: 'Uni', date: '05/01/21-08/15/21', time: '0800', location: '33710', amount: 250, gradingFormat: 'A-F', passingGrade: 'C', justification: 'Computers!', comments: ''}], approval: [{firstApprover: '', secondApprover: '', approved: 'Pending', approvedAmount: calReimbAmount(250, 'Uni')}]}).then(() => {});
    reimbService.addReimb({idReimb: '111112', usernameRequestor: 'emp1', requestorDetails: [{firstName: 'Joe', lastName: 'Employee'}], usernameAssigned: 'hr1', course: [{description: 'Printer repair training', courseType: 'Tech', date: '02/18/21', time: '1100', location: '33701', amount: 300, gradingFormat: 'Complete/Incomplete', passingGrade: '', justification: 'Also printers!', comments: ''}], approval: [{firstApprover: 'sup1', secondApprover: 'mgr1', approved: 'Pending', approvedAmount: calReimbAmount(300, 'Tech')}]}).then(() => {});
    reimbService.addReimb({idReimb: '121111', usernameRequestor: 'emp2', requestorDetails: [{firstName: 'Susan', lastName: 'Employee'}], usernameAssigned: 'sup1', course: [{description: 'Computer class', courseType: 'Uni', date: '05/01/21-08/15/21', time: '0800', location: '33710', amount: 250, gradingFormat: 'A-F', passingGrade: 'C', justification: 'Computers!', comments: ''}], approval: [{firstApprover: '', secondApprover: '', approved: 'Pending', approvedAmount: calReimbAmount(250, 'Uni')}]}).then(() => {});
    reimbService.addReimb({idReimb: '131111', usernameRequestor: 'emp3', requestorDetails: [{firstName: 'Trevor', lastName: 'Employee'}], usernameAssigned: 'sup2', course: [{description: 'Computer class', courseType: 'Uni', date: '05/01/21-08/15/21', time: '0800', location: '33710', amount: 250, gradingFormat: 'A-F', passingGrade: 'C', justification: 'Computers!', comments: ''}], approval: [{firstApprover: '', secondApprover: '', approved: 'Pending', approvedAmount: calReimbAmount(250, 'Uni')}]}).then(() => {});
    reimbService.addReimb({idReimb: '141111', usernameRequestor: 'emp4', requestorDetails: [{firstName: 'Amelia', lastName: 'Employee'}], usernameAssigned: 'sup2', course: [{description: 'Computer class', courseType: 'Uni', date: '05/01/21-08/15/21', time: '0800', location: '33710', amount: 250, gradingFormat: 'A-F', passingGrade: 'C', justification: 'Computers!', comments: ''}], approval: [{firstApprover: '', secondApprover: '', approved: 'Pending', approvedAmount: calReimbAmount(250, 'Uni')}]}).then(() => {});
    reimbService.addReimb({idReimb: '211111', usernameRequestor: 'sup1', requestorDetails: [{firstName: 'Wanda', lastName: 'Supervisor'}], usernameAssigned: 'mgr1', course: [{description: 'Self-help seminar', courseType: 'Sem', date: '03/14/21', time: '1100', location: '32526', amount: 400, gradingFormat: 'Complete/Incomplete', passingGrade: '', justification: 'I like seminars', comments: ''}], approval: [{firstApprover: '', secondApprover: '', approved: 'Pending', approvedAmount: calReimbAmount(400, 'Sem')}]}).then(() => {});
    reimbService.addReimb({idReimb: '221111', usernameRequestor: 'sup2', requestorDetails: [{firstName: 'Scott', lastName: 'Supervisor'}], usernameAssigned: 'mgr1', course: [{description: 'Self-help seminar', courseType: 'Sem', date: '03/14/21', time: '1100', location: '32526', amount: 400, gradingFormat: 'Complete/Incomplete', passingGrade: '', justification: 'I like seminars', comments: ''}], approval: [{firstApprover: '', secondApprover: '', approved: 'Pending', approvedAmount: calReimbAmount(400, 'Sem')}]}).then(() => {});
    reimbService.addReimb({idReimb: '311111', usernameRequestor: 'mgr1', requestorDetails: [{firstName: 'Jane', lastName: 'Manager'}], usernameAssigned: 'hr1', course: [{description: 'A++ Prep', courseType: 'CertPrep', date: '02/24/21', time: '', location: '33712', amount: 600, gradingFormat: 'Pass/Fail', passingGrade: '', justification: 'Serious business', comments: ''}],  approval: [{firstApprover: '', secondApprover: '', approved: 'Pending', approvedAmount: calReimbAmount(600, 'CertPrep')}]}).then(() => {});
}