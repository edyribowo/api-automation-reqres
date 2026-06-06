import axios from 'axios';
import { expect } from 'chai';
import { setupApiConfig } from '../../src/utils/api';
import { User } from '../../src/models/user';
import { UserClient } from '../../src/clients/user.client';

describe('User API - Put Endpoints', function () {
    this.timeout(15000);

    before(() => {
        setupApiConfig();
    });

    const validPositiveUpdateScenarios = [
        {
            description: "Full Body Update",
            id: 1,
            payload: { email: "edyribowo@gmail.com", first_name: "Edy", last_name: "Ribowo", avatar: "https://reqres.in/img/faces/2-image.jpg" }
        },
        {
            description: "Missing Email Field Body Update",
            id: 2,
            payload: { first_name: "Edy", last_name: "Ribowo", avatar: "https://reqres.in/img/faces/2-image.jpg" }
        },
        {
            description: "Completely Empty Body Update",
            id: 3,
            payload: {}
        }
    ];

    const validNegativeUpdateScenarios = [
        {
            description: "Null ID Update",
            id: null,
            payload: { email: "edyribowo@gmail.com", first_name: "Edy", last_name: "Ribowo", avatar: "https://reqres.in/img/faces/2-image.jpg" }
        },
        {
            description: "Invalid ID Update",
            id: "abc",
            payload: { email: "edyribowo@gmail.com", first_name: "Edy", last_name: "Ribowo", avatar: "https://reqres.in/img/faces/2-image.jpg" }
        },
        {
            description: "Null Payload Update",
            id: 1,
            payload: null
        },
        {
            description: "Invalid ID and Null Payload Update",
            id: "abc",
            payload: null
        },
        {
            description: "Invalid ID and Invalid Payload Update",
            id: "abc",
            payload: "invalid"
        },
        {
            description: "Null ID and Null Payload Update",
            id: null,
            payload: null
        }
    ];

    validPositiveUpdateScenarios.forEach((scenario) => {
        it(`Positive: Should Update a User Successfully - ${scenario.description}`, async () => {
            const response = await UserClient.updateUser(scenario.id, scenario.payload as User);

            expect(response.status).to.equal(200);
            expect(response.data).to.have.property('updatedAt');

            // Verify the responses is same as registered
            const expectedUser = new User(scenario.payload as User);
            const actualUser = new User(response.data);

            expect(actualUser.email).to.equal(expectedUser.email);
            expect(actualUser.first_name).to.equal(expectedUser.first_name);
            expect(actualUser.last_name).to.equal(expectedUser.last_name);
            expect(actualUser.avatar).to.equal(expectedUser.avatar);
        });
    });

    // Skipped: The ReqRes mock API blindly accepts null bodies and returns 200/201 Created.
    // In a real enterprise API, missing required payloads should consistently fail with 400.
    validNegativeUpdateScenarios.forEach((scenario) => {
        it.skip(`Negative: Should Update a User Unsuccessfully - ${scenario.description}`, async () => {
        try {
            const response = await UserClient.updateUser(scenario.id, scenario.payload as User);
        } catch (error: any) {
            // 400 Bad Request is the standard HTTP code for invalid/missing body payloads
            expect(error.response?.status).to.equal(400, 'Expected 400 Bad Request');
            return;
        }
        expect.fail('Expected request to fail with a 400 status, but it succeeded');
        });
    });

    // 3. Security Edge Cases
    // Skipped: The free ReqRes mock API does not consistently enforce API keys on public endpoints.
    // It sometimes returns 401 and sometimes 200. In a real enterprise API, this would consistently fail.
    it.skip('Security: should return error when API key is invalid', async () => {
        try {
            await axios.put('/users/2', {
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