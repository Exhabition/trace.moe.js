// Dependencies
const { create } = require("axios").default;

// Types
// const { SearchResponse, AccountDetails } = require("./index.d.ts");

// Constants
const BASE_URL = "https://api.trace.moe";

// Config
const axiosConfig = create({
    baseURL: BASE_URL,
})

const { get } = axiosConfig;

class Client {
    constructor(apiKey) {
        if (apiKey) {
            this._apiKey = apiKey;

            axiosConfig.defaults.headers.common["x-trace-key"] = this._apiKey;
        }
    }

    /**
     * Account details of the key provided or the current IP address if no key is provided. 
     * @returns {AccountDetails}
     */
    async getAccountInfo() {
        const result = await get("/me").catch(error => error.response);
        return result.data;
    }

    /**
     * @param {string} url A valid url leading to an image
     * @param {Object} options An object with optional settings to add to the URL
     * @param {Boolean} options.cutBorders Whether black borders should be cut or not
     * @param {Number} options.anilistID A specific AniList ID to filter 
     * @param {cutBorders} options.anilistInfo Whether to include extra AniList info (takes longer)
     * @returns {SearchResponse}
     */
    async getSimilarFromURL(url, options) {
        if (!url || typeof url !== "string")
            return new TypeError(`[getSimilarFromURL] 'url' should be a string, got ${typeof url}`);
        if (options?.anilistID && !Number.isInteger(parseInt(options.anilistID)))
            return new TypeError(`[getSimilarFromURL] 'options.anilistID' should be an integer, got ${options.anilistID}`);

        let fullURL = `${BASE_URL}/search?url=${encodeURIComponent(url)}`;
        if (options?.cutBorders) fullURL += "?cutBorders";
        if (options?.anilistID) fullURL += `?anilistID=${options.anilistID}`;
        if (options?.anilistInfo) fullURL += "?anilistInfo";

        const result = await get(fullURL).catch(error => error.response);
        return result.data;
    }

    /**
     * @returns {SearchResponse}
     */
    async getSimilarFromBuffer(buffer, options) {

    }
}

module.exports = { Client };

new Client().getSimilarFromURL("https://cdn.discordapp.com/attachments/838500479444844615/891991856970354708/y2mate.com_-_Asked_for_sprite_and_they_gave_me_clown_juice_v240P.mp4").then(result => console.log(result));