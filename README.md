### 2012-react-projectOne
Tuition Reimbursement Management System

#### Description
An application to allow employees to submit requests for tuition reimbursements for business related courses, certifications, and trainings, along with any other applicable subjects. The request follows an approval track that culminates with a Benefits Coordinator. At any point, an approver may request additional information from the requestor or any prior approvers before making an approval decision. After approval, the request is pending until the employee submits their score or presentation. Then, the score or presentation will be confirmed, and the reimbursement request will be considered complete and funds provided to the employee.

#### Technology Stack
JavaScript/TypeScript
Express
DynamoDB
React
Redux
HTML/CSS

#### Features
- Any employee can submit a reimbursement request
- Any approver can ask for further infromation from the requestor or any previous approver
- A benefits coordinator can change the reimbursement amount
- The requestor can accept or decline the change in amount
- The requestor can cancel their request at any time
- The requestor can submit their final grade
- Upon grade submission, an approver will confirm or deny the request
- The available, pending, and awarded reimbursement amounts will be automatically tracked and updated throughout the claim process

#### Setup
For both the front and back end:

    'npm install'
    'npm run start'
The front end server will be located at http://localhost:3000/