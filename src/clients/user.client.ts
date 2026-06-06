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
     * Fetches a paginated list of users.
     * @param page The page number to fetch
     */
    public static async getUsersByPage(page: number | null) {
        return axios.get(`${this.ENDPOINT}?page=${page}`);
    }

    /**
     * Creates a new user.
     * @param userData The data for the user to create
     */
    public static async createUser(userData: User | null) {
        return axios.post(`${this.ENDPOINT}`, userData);
    }

    /**
     * Update a user.
     * @param userData The data for the user to update
     */
    public static async updateUser(userId: string | number | null, userData: User | null) {
        return axios.put(`${this.ENDPOINT}/${userId}`, userData);
    }

    /**
     * Delete a user.
     * @param userId The ID of the user to delete
     */
    public static async deleteUserById(userId: string | number | null) {
        return axios.delete(`${this.ENDPOINT}/${userId}`);
    }
}
