'use strict';

export class AuthProxy {
    constructor(client, token, method = 'jwt') {
        this.client = client;
        this.token = token;
        this.method = method;
    }

    setMethod(method) {
        this.method = method;
    }

    async request(options = {}) {
        const newOptions = {
            url: '',
            method: 'GET',
            headers: {},
            ...options
        };

        newOptions.headers = {
            ...(options.headers || {})
        };

        if (!this.token) {
            return this.client.request(newOptions);
        } 

        switch (this.method) {
            case 'jwt':
                newOptions.headers.Authorization = 'Bearer ' + this.token;
                break;
            case 'apiKey':
                newOptions.headers['x-api-key'] = this.token;
                break;
            case 'oauth':
                newOptions.headers.Authorization = 'OAuth ' + this.token;
                break;
            default:
            console.warn('Невизначений метод:', this.method);
        }
        return this.client.request(newOptions);
    }
}