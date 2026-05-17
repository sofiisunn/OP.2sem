'use strict';

export class AuthProxy {
    constructor(client, token, method) {
        this.client = client;
        this.token = token;
        this.method = method;
    }

    setMethod(method) {
        this.method = method;
    }

    async request(options) {
        const newOptions = { ...options }
        newOptions.headers = { ...newOptions.headers };
        if (this.method === 'jwt') {
            newOptions.headers.Authorization = 'Bearer ' + this.token;
        }
        if (this.method === 'apiKey') {
            newOptions.headers['x-api-key'] = this.token;
        }
        if (this.method === 'oauth') {
            newOptions.headers.Authorization = 'OAuth ' + this.token;
        }
        return this.client.request(newOptions);
    }
}