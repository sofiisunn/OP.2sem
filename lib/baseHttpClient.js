'use strict';

export class BaseHttpClient {
    async request({ url, method = 'GET', headers = {}, body = null }) {
        let requestBody = null;

        if (body) {
            requestBody = JSON.stringify(body);
        }

        const response = await fetch(url, {
            method,
            headers,
            body: requestBody
        });

        if (!response.ok) {
            throw new Error("HTTP error: " + response.status);
        }

        return await response.json();
    }
}