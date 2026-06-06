import axios from 'axios';
import { expect } from 'chai';
import { setupApiConfig } from '../../src/utils/api';
import { User } from '../../src/models/user';
import { UserClient } from '../../src/clients/user.client';

describe('User API - DELETE Endpoints', function () {
    // This timeout for latency call purposes
    this.timeout(15000);

    before(() => {
        // Run configuration once before any tests start
        setupApiConfig();
    });

    const validDeleteScenarios = [
        {
            description: "Valid ID using ID 1",
            id: 1
        },
        {
            description: "Valid ID using ID 0",
            id: 0
        }
    ];

    const invalidDeleteScenarios = [
        {
            description: "Invalid ID using ID null",
            id: null
        },
        {
            description: "Invalid ID using ID string abc",
            id: "abc"
        }
    ];

    validDeleteScenarios.forEach((userData) => {
        it(`Positive: Should Delete a User Successfully - ${userData.description}`, async () => {
            const response = await UserClient.deleteUserById(userData.id);

            expect(response.status).to.equal(204);
        });
    });

    // 2. Negative Edge Cases (Invalid Identifiers)
    // Skipped: The ReqRes mock API blindly accepts invalid bodies and returns 200/201 Created.
    // In a real enterprise API, missing required payloads should consistently fail with 400.
    invalidDeleteScenarios.forEach((userData) => {
        it.skip(`Negative: Should Delete a User Unsuccessfully - ${userData.description}`, async () => {
        try {
            const response = await UserClient.deleteUserById(userData.id);
        } catch (error: any) {
            // 400 Bad Request is the standard HTTP code for invalid/missing body payloads
            expect(error.response?.status).to.equal(400, 'Expected 400 Bad Request');
            return;
        }
        expect.fail('Expected request to fail with a 400 status, but it succeeded');
        });
    });

    it('Edge Case: should return 204 No Content for Empty ID', async () => {
        const response = await UserClient.deleteUserById("");

        expect(response.status).to.equal(204);
    });

    // 3. Security Edge Cases
    // Skipped: The free ReqRes mock API does not consistently enforce API keys on public endpoints.
    // It sometimes returns 401 and sometimes 200. In a real enterprise API, this would consistently fail.
    it.skip('Security: should return error when API key is invalid', async () => {
        try {
            await axios.delete('/users/2', {
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