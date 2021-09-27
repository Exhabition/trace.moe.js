const { get } = require("axios").default;

const BASE_URL = "https://api.trace.moe";

class Client {
    constructor(key) {
        if (key) this.key = key;
    }

    /**
     * Account details of the key provided or the current IP address if no key is provided. 
     * @returns 
     */
    async getAccountInfo() {
        return get(`${BASE_URL}/me`).catch(response => response.error.data);
    }
}

module.exports = Client;