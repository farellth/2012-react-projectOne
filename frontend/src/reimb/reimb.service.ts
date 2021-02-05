import axios from 'axios';

import { Reimb } from './reimb';

class ReimbService {
    private URI: string;
    constructor() {
        this.URI = process.env.REACT_APP_SERVER_URI + 'reimbs';
    }

    getAllReimbs(): Promise<Reimb[]> {
        return axios.get(this.URI).then(result => result.data);
    }
    getReimb(idReimb: string): Promise<Reimb> {
        console.log(JSON.stringify(axios.get(this.URI + '/' + idReimb).then(result => result.data)));
        return axios.get(this.URI + '/' + idReimb).then(result => result.data);
    }
    addReimb(reimb: Reimb): Promise<null> {
        console.log('reimbService.addReimb');
        return axios.post(this.URI, reimb).then(result => null);
    }
    updateReimb(reimb: Reimb): Promise<null> {
        console.log('reimbService.updateReimb');
        return axios.put(this.URI, reimb).then(result => null);
    }
    removeReimb(idReimb: string): Promise<null> {
        return axios.delete(this.URI+'/'+idReimb, {withCredentials: true}).then(result => null);
    }
}

const reimbService = new ReimbService();
export default reimbService;