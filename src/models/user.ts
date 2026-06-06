export class User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    avatar: string;

    constructor(data: Partial<User>) {
        this.id = data.id || 0;
        this.email = data.email || '';
        this.first_name = data.first_name || '';
        this.last_name = data.last_name || '';
        this.avatar = data.avatar || '';
    }
}

export interface UserResponse {
    data: {
        id: number;
        email: string;
        first_name: string;
        last_name: string;
        avatar: string;
    };
    support: {
        url: string;
        text: string;
    };
}
