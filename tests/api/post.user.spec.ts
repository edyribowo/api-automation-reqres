import axios from 'axios';
import { expect } from 'chai';
import { setupApiConfig } from '../../src/utils/api';
import { User } from '../../src/models/user';
import { UserClient } from '../../src/clients/user.client';

describe('User API - POST Endpoints', function () {
    this.timeout(15000);

    before(() => {
        setupApiConfig();
    });

    const validPostScenarios = [
        {
            description: "Full Body Payload Create User",
            payload: { email: "edyribowo@gmail.com", first_name: "Edy", last_name: "Ribowo", avatar: "https://reqres.in/img/faces/2-image.jpg" }
        },
        {
            description: "Missing Email Field Create User",
            payload: { first_name: "Edy", last_name: "Ribowo", avatar: "https://reqres.in/img/faces/2-image.jpg" }
        },
        {
            description: "Completely Empty Body Create User",
            payload: {}
        },
        {
            description: "Invalid Body Create User",
            payload: "invalid"
        }
    ];

    validPostScenarios.forEach((scenario) => {
        it(`Positive: Should Create a New User Successfully - ${scenario.description}`, async () => {
            const response = await UserClient.createUser(scenario.payload as User);

            expect(response.status).to.equal(201);
            expect(response.data).to.have.property('createdAt');
            expect(response.data).to.have.property('id');

            // Verify the responses is same as registered
            const expectedUser = new User(scenario.payload as User);
            const actualUser = new User(response.data);

            expect(actualUser.email).to.equal(expectedUser.email);
            expect(actualUser.first_name).to.equal(expectedUser.first_name);
            expect(actualUser.last_name).to.equal(expectedUser.last_name);
            expect(actualUser.avatar).to.equal(expectedUser.avatar);
        });
    });

    // 2. Negative Cases
    // Skipped: The ReqRes mock API blindly accepts null bodies and returns 201 Created.
    // In a real enterprise API, missing required payloads should consistently fail with 400.
    it.skip('Negative: should return 400 Bad Request for NULL Body', async () => {
        try {
            await UserClient.createUser(null);
        } catch (error: any) {
            // 400 Bad Request is the standard HTTP code for invalid/missing body payloads
            expect(error.response?.status).to.equal(400, 'Expected 400 Bad Request');
            return;
        }
        expect.fail('Expected request to fail with a 400 status, but it succeeded');
    });

    // 3. Security Edge Cases
    // Skipped: The free ReqRes mock API does not consistently enforce API keys on public endpoints.
    // It sometimes returns 401 and sometimes 200. In a real enterprise API, this would consistently fail.
    it.skip('Security: should return error when API key is invalid', async () => {
        try {
            await axios.post('/users', {
                headers: { 'x-api-key': 'fake-invalid-key-123' }
            });
        } catch (error: any) {
            const status = error.response?.status;
            expect([401, 403]).to.include(status, `Expected 401 or 403 status but got ${status}`);
            return;
        }
        expect.fail('Expected request to fail due to invalid API key, but it succeeded');
    });
});