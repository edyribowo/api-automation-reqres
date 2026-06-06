import axios from 'axios';

export class UserClient {
    private static readonly ENDPOINT = '/users';

    /**
     * Fetches a user by their ID.
     * @param userId The ID of the user to fetch
     */
    public static async getUserById(userId: string | number | null) {
        return axios.get(`${this.ENDPOINT}/${userId}`);
    }
}
