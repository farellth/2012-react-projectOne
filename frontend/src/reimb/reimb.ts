export class Reimb {
    idReimb: string = '';
    usernameRequestor: string = '';
    requestorDetails: RequestorDetails[] = [];
    usernameAssigned: string = '';
    course: Course[] = [];
    approval: Approval[] = [];
}

export interface RequestorDetails {
    firstName: string;
    lastName: string;
}

export class Course {
    description: string = '';
    courseType: string = '';
    date: string = '';
    time: string = '';
    location: string = '';
    amount: number = 0;
    gradingFormat: string = '';
    passingGrade: string = '';
    justification: string = '';
    comments: string = '';
}

export interface Approval {
    firstApprover: string;
    secondApprover: string;
    approved: string;
    approvedAmount?: number;
    exceedsAvail?: boolean;
    reasonDeclined?: string;
    reasonInfo?: string;
    usernameInfoRequestor?: string;
    usernameInfoProvider?: string;
    reasonAmountChange?: string;
    grade?: string;
    completed?: boolean;
}