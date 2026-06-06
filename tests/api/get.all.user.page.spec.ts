import axios from 'axios';
import { expect } from 'chai';
import { setupApiConfig } from '../../src/utils/api';
import { UserClient } from '../../src/clients/user.client';

describe('User API - GET All Users (Paginated)', function () {
    this.timeout(15000);

    before(() => {
        setupApiConfig();
    });

    // 1. Data-Driven Testing for Pagination
    const validPageScenarios = [
        {
            description: "First Page",
            page: 1,
            expected: { page: 1, per_page: 6, total: 12, total_pages: 2, expectedDataLength: 6 }
        },
        {
            description: "Second Page",
            page: 2,
            expected: { page: 2, per_page: 6, total: 12, total_pages: 2, expectedDataLength: 6 }
        },
        {
            description: "Edge Cases: Non Exist Page",
            page: 999999,
            expected: { page: 999999, per_page: 6, total: 12, total_pages: 2, expectedDataLength: 0 }
        }
    ];

    const invalidPageScenarios = [
        {
            description: "Negative Value",
            page: -1,
        },
        {
            description: "Invalid Value",
            page: "abc",
        },
        {
            description: "Null Value",
            page: null,
        }
    ];

    validPageScenarios.forEach((scenario) => {
        it(`Positive: Should Fetch Users Successfully - ${scenario.description}`, async () => {
            const response = await UserClient.getUsersByPage(scenario.page);

            expect(response.status).to.equal(200);
            
            // Assert the Pagination Metadata
            expect(response.data.page).to.equal(scenario.expected.page);
            expect(response.data.per_page).to.equal(scenario.expected.per_page);
            expect(response.data.total).to.equal(scenario.expected.total);
            expect(response.data.total_pages).to.equal(scenario.expected.total_pages);
            
            // Assert the Array Payload
            expect(response.data.data).to.be.an('array');
            expect(response.data.data).to.have.lengthOf(scenario.expected.expectedDataLength);

            // Optional: If the array has items, verify that the first item perfectly maps to the User POJO!
            if (response.data.data.length > 0) {
                const firstUser = response.data.data[0];
                expect(firstUser).to.have.property('id');
                expect(firstUser).to.have.property('email');
            }
        });
    });

    // 2. Negative Cases
    // Skipped: The ReqRes mock API blindly accepts invalid page inputs and returns 200
    // In a real enterprise API, invalid page inputs should consistently fail with 400
    invalidPageScenarios.forEach((scenario) => {
        it.skip(`Negative: Should Return 400 Bad Request for ${scenario.description}`, async () => {
            try {
                await UserClient.getUsersByPage(scenario.page as unknown as number);
            } catch (error: any) {
                expect(error.response?.status).to.equal(400, 'Expected 400 Bad Request');
                return;
            }
            expect.fail('Expected request to fail with a 400 status, but it succeeded');
        });
    });

    // 3. Security Edge Cases
    // Skipped: The ReqRes mock API does not consistently enforce API keys on public endpoints.
    // It sometimes returns 401 and sometimes 200. In a real enterprise API, this would consistently fail.
    it.skip('Security: should return error when API key is invalid', async () => {
        try {
            await axios.get('/users?page=1', {
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