import axios from 'axios';
import { expect } from 'chai';
import { setupApiConfig } from '../../src/utils/api';

describe('User API', function () {
    this.timeout(15000); // Set timeout to 15 seconds for live API latency

    before(() => {
        setupApiConfig();
    });

    it('should get user successfully', async () => {

        const response = await axios.get(
            'https://reqres.in/api/users/2'
        );

        expect(response.status).to.equal(200);

        expect(
            response.data.data.id
        ).to.equal(2);

    });

});