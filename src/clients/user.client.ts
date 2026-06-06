import axios from 'axios';
import { User } from '../models/user';

export class UserClient {
    private static readonly ENDPOINT = '/users';

    /**
     * Fetches a user by their ID.
     * @param userId The ID of the user to fetch
     */
    public static async getUserById(userId: string | number | null) {
        return axios.get(`${this.ENDPOINT}/${userId}`);
    }

    /**
     * Creates a new user.
     * @param userData The data for the user to create
     */
    public static async createUser(userData: User | null) {
        return axios.post(`${this.ENDPOINT}`, userData);
    }
}
