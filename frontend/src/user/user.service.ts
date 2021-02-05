import axios from 'axios';
import { User } from './user';

class UserService {
    private URI: string;
    constructor() {
        this.URI = 'http://localhost:3000/users';
    }

    login(user: User): Promise<User> {
        return axios.post(this.URI, user, {withCredentials: true}).then(result => result.data);
    }
    logout(): Promise<null> {
        return axios.delete(this.URI, {withCredentials: true}).then(result => null);
    }
    getUser(username: string) : Promise<User> {
        console.log('userService.getUser');
        return axios.get(this.URI + '/' + username).then(result => result.data);
    }
    updateUser(user: User): Promise<null> {
        console.log('userService.updateUser');
        return axios.put(this.URI, user).then(result => null);
    }
}

export default new UserService();