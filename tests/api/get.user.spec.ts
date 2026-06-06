import axios from 'axios';
import { expect } from 'chai';
import { setupApiConfig } from '../../src/utils/api';
import { User } from '../../src/models/user';
import { UserClient } from '../../src/clients/user.client';

describe('User API - GET Endpoints', function () {
    // This timeout for latency call purposes
    this.timeout(15000);

    before(() => {
        // Run configuration once before any tests start
        setupApiConfig();
    });

    // 1. Data-Driven Testing (Parameterization)
    const validUsers = [
        { id: 2, email: "janet.weaver@reqres.in", first_name: "Janet", last_name: "Weaver", avatar: "https://reqres.in/img/faces/2-image.jpg" },
        { id: 3, email: "emma.wong@reqres.in", first_name: "Emma", last_name: "Wong", avatar: "https://reqres.in/img/faces/3-image.jpg" }
    ];

    validUsers.forEach((userData) => {
        it(`Positive: should get user successfully for valid ID (${userData.id})`, async () => {
            const response = await UserClient.getUserById(userData.id);

            expect(response.status).to.equal(200);

            // Pass the entire userData object directly since it now contains all required fields
            const expectedUser = new User(userData);
            const actualUser = new User(response.data.data);

            expect(actualUser).to.deep.equal(expectedUser);
        });
    });

    // 2. Negative Edge Cases (Invalid Identifiers)
    const invalidUsers = [
        { description: "NULL ID", id: null },
        { description: "invalid string ID", id: "abc" },
        { description: "Negative Integer ID", id: -1 }
    ];

    invalidUsers.forEach((scenario) => {
        it(`Negative: should return 404 for ${scenario.description}`, async () => {
            try {
                await UserClient.getUserById(scenario.id);
            } catch (error: any) {
                expect(error.response?.status).to.equal(404, 'Expected 404 status but got different error');
                return;
            }
            expect.fail('Expected request to fail with a 404 status, but it succeeded');
        });
    });

    it('Edge Case: should return the list of users (200 OK) for Empty ID', async () => {
        const response = await UserClient.getUserById("");
        
        expect(response.status).to.equal(200);

        expect(response.data).to.have.property('page');
        expect(response.data).to.have.property('data');
        expect(response.data.data).to.be.an('array');
    });

    // 3. Security Edge Cases
    // Skipped: The free ReqRes mock API does not consistently enforce API keys on public endpoints.
    // It sometimes returns 401 and sometimes 200. In a real enterprise API, this would consistently fail.
    it.skip('Security: should return error when API key is invalid', async () => {
        try {
            await axios.get('/users/2', {
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