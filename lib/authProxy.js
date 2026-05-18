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

    applyAuth(options) {
        switch (this.method) {
            case 'jwt':
                options.headers.Authorization = 'Bearer ' + this.token;
                break;
            case 'apiKey':
                options.headers['x-api-key'] = this.token;
                break;
            case 'oauth':
                options.headers.Authorization = 'OAuth ' + this.token;
                break;
            default:
                console.warn('Невизначений метод:', this.method);
        }
    }

    async request(options = {}) {
        const newOptions = {
            url: '',
            method: 'GET',
            headers: {},
            ...options,
        };

        newOptions.headers = { ...(options.headers || {}) };

        if (!this.token) {
            return this.client.request(newOptions);
        }

        this.applyAuth(newOptions);

        try {
            return await this.client.request(newOptions);
        } catch (error) {
            if (error.message.includes('401')) {
                this.token = 'new-valid-token';
                this.applyAuth(newOptions);
                return this.client.request(newOptions);
            }
            throw error;
        }
    }
}