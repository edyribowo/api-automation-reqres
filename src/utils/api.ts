import axios from 'axios';
import * as path from 'path';
import * as fs from 'fs';

let isConfigured = false;

/**
 * Loads environment variables from `.env` (using Node's native env loader)
 * and configures Axios global defaults such as the API key.
 */
export function setupApiConfig(): void {
    if (isConfigured) {
        return;
    }
    isConfigured = true;

    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
        try {
            process.loadEnvFile(envPath);
        } catch (error) {
            console.warn('Could not load .env file programmatically:', error);
        }
    }
    
    const apiKey = process.env.REQRES_API_KEY;
    if (apiKey) {
        axios.defaults.headers.common['x-api-key'] = apiKey;
    }

    const baseUrl = process.env.BASE_URL;
    if (baseUrl) {
        axios.defaults.baseURL = baseUrl;
    }

    // Request interceptor for logging
    axios.interceptors.request.use((config) => {
        console.log(`\n\x1b[1m\x1b[36m>>> [API REQUEST] >>>\x1b[0m`);
        console.log(`\x1b[33mMethod:\x1b[0m ${config.method?.toUpperCase()}`);
        console.log(`\x1b[33mURL:\x1b[0m    ${config.url}`);
        if (config.headers) {
            // Create a copy of headers and redact x-api-key for security
            const headersCopy = { ...config.headers };
            for (const key of Object.keys(headersCopy)) {
                if (key.toLowerCase() === 'x-api-key') {
                    headersCopy[key] = '***REDACTED***';
                }
            }
            console.log(`\x1b[33mHeaders:\x1b[0m`, JSON.stringify(headersCopy, null, 2));
        }
        if (config.data) {
            console.log(`\x1b[33mBody:\x1b[0m`, JSON.stringify(config.data, null, 2));
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    // Response interceptor for logging
    axios.interceptors.response.use((response) => {
        console.log(`\x1b[1m\x1b[32m<<< [API RESPONSE] <<<\x1b[0m`);
        console.log(`\x1b[33mStatus:\x1b[0m  ${response.status} ${response.statusText}`);
        if (response.data) {
            console.log(`\x1b[33mBody:\x1b[0m`, JSON.stringify(response.data, null, 2));
        }
        console.log(`\x1b[36m-----------------------\x1b[0m\n`);
        return response;
    }, (error) => {
        console.log(`\x1b[1m\x1b[31m<<< [API ERROR RESPONSE] <<<\x1b[0m`);
        if (error.response) {
            console.log(`\x1b[33mStatus:\x1b[0m  ${error.response.status} ${error.response.statusText}`);
            console.log(`\x1b[33mBody:\x1b[0m`, JSON.stringify(error.response.data, null, 2));
        } else {
            console.log(`\x1b[33mError:\x1b[0m   ${error.message}`);
        }
        console.log(`\x1b[31m----------------------------\x1b[0m\n`);
        return Promise.reject(error);
    });
}
