// Dependencies
const { create } = require("axios").default;

// Constants
const BASE_URL = "https://api.trace.moe";
const FILE_SIZES = {
    large: "l",
    medium: "m",
    small: "s",
}

// Config
const axiosConfig = create({
    baseURL: BASE_URL,
})

const { get } = axiosConfig;

class MediaPreview {
    constructor(url) {
        this.url = url;
        this.muted = false;
        this.size = FILE_SIZES.medium
    }

    mute() {
        this.muted = true;
        this.url += "&muted";

        return this;
    }

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
        const result = await get("/me").catch(error => error.response);
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

        let fullURL = `${BASE_URL}/search?url=${encodeURIComponent(url)}`;
        if (options?.cutBorders) fullURL += "?cutBorders";
        if (options?.anilistID) fullURL += `?anilistID=${options.anilistID}`;
        if (options?.anilistInfo) fullURL += "?anilistInfo";

        const result = await get(fullURL).catch(error => error.response);

        if (options?.useAdvancedPreviews) {
            const allResults = result.data?.result;
            if (allResults?.length > 0) {
                for (let i = 0; i < allResults.length; i++) {
                    const matchResult = allResults[i];

                    const videoPreview = new MediaPreview(matchResult.video);
                    allResults[i].video = videoPreview

                    const imagePreview = new MediaPreview(matchResult.image);
                    allResults[i].image = imagePreview
                }
            };
        }

        return result.data;
    }

    /**
     * @returns {SearchResponse}
     */
    async getSimilarFromBuffer(buffer, options) {

    }
}

module.exports = { Client, MediaPreview };