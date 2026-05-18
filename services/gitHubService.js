'use strict';

export class GitHubService {
    constructor(client) {
        this.client = client;
    }
    getUser(username) {
        return this.client.request({
        url: `https://api.github.com/users/${username}`,
        method: 'GET'
        });
    }
}