'use strict';

export class AuthProxy {
    constructor(client, token) {
        this.client = client;
        this.token = token;
    }

    async request(options) {
        options.headers = options.headers || {};
        options.headers.Authorization = 'Bearer ' + this.token;

        return this.client.request(options);
    }
}