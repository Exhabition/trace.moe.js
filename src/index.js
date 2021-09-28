// Dependencies
const { create } = require("axios").default;

// Constants
const { BASE_URL, ACCOUNT_ENDPOINT, SEARCH_ENDPOINT } = require("../constants/endpoints.json");
const { FILE_SIZES } = require("../constants/fileInfo.json");

// Config
const axiosConfig = create({
    baseURL: BASE_URL,
});
const { get, post } = axiosConfig;

// Helper
const { getTraceSettings, convertMediaPreviews } = require("./helper");

class MediaPreview {
    constructor(url) {
        this.url = url;
        this.muted = false;
        this.size = FILE_SIZES.medium
    }

    /**
     * Mutes the sound of the media preview.
     */
    mute() {
        this.muted = true;
        this.url += "&muted";

        return this;
    }

    /**
     * Sets the size of the media preview.
     * @param {"large" | "medium" | "small"} size The size of the media preview
     */
    setSize(size) {
        size = size.toLowerCase();

        let selectedSize;
        if (Object.keys(FILE_SIZES).includes(size)) {
            selectedSize = FILE_SIZES[size];
        } else if (Object.values(FILE_SIZES).includes(size)) {
            selectedSize = size;
        }

        this.size = selectedSize;
        this.url += `&size=${selectedSize}`;
    }
}

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
        const result = await get(ACCOUNT_ENDPOINT).catch(error => error.response);
        return result.data;
    }

    /**
     * @param {string} url A valid url leading to an image
     * @param {Object} options An object with optional settings to add to the URL
     * @param {Boolean} options.cutBorders Whether black borders should be cut or not
     * @param {Number} options.anilistID A specific AniList ID to filter 
     * @param {Boolean} options.anilistInfo Whether to include extra AniList info (takes longer)
     * @param {Boolean} options.useAdvancedPreviews Wether to use special media preview class instead of just a single url
     * @returns {SearchResponse}
     */
    async getSimilarFromURL(url, options) {
        if (!url || typeof url !== "string")
            return new TypeError(`[getSimilarFromURL] 'url' should be a string, got ${typeof url}`);
        if (options?.anilistID && !Number.isInteger(parseInt(options.anilistID)))
            return new TypeError(`[getSimilarFromURL] 'options.anilistID' should be an integer, got ${options.anilistID}`);

        const urlSettings = getTraceSettings(url, options);
        const result = await get(`${SEARCH_ENDPOINT}${urlSettings}`).catch(error => error.response);

        if (options?.useAdvancedPreviews) convertMediaPreviews(result.data?.result);

        return result.data;
    }

    /**
     * @param {Buffer} buffer A valid buffer to upload (max 25MB)
     * @param {Object} options An object with optional settings to add to the URL
     * @param {Boolean} options.cutBorders Whether black borders should be cut or not
     * @param {Number} options.anilistID A specific AniList ID to filter 
     * @param {Boolean} options.anilistInfo Whether to include extra AniList info (takes longer)
     * @param {Boolean} options.useAdvancedPreviews Wether to use special media preview class instead of just a single url
     * @returns {SearchResponse}
     */
    async getSimilarFromBuffer(buffer, options) {
        if (!buffer || !Buffer.isBuffer(buffer))
            return new TypeError(`[getSimilarFromURL] 'buffer' should be a Buffer, got ${typeof buffer}`);
        if (options?.anilistID && !Number.isInteger(parseInt(options.anilistID)))
            return new TypeError(`[getSimilarFromURL] 'options.anilistID' should be an integer, got ${options.anilistID}`);

        const urlSettings = getTraceSettings(null, options);
        const result = await post(`${SEARCH_ENDPOINT}${urlSettings}`, {
            body: buffer,
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        }).catch(error => error.response);

        if (options?.useAdvancedPreviews) convertMediaPreviews(result.data?.result);

        return result.data;
    }
}

module.exports = { Client, MediaPreview };