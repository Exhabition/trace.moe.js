module.exports = {
    getTraceSettings: (url, options) => {
        let fullURL = "";

        if (url) fullURL += `?url=${encodeURIComponent(url)}`;
        if (options?.cutBorders) fullURL += "?cutBorders";
        if (options?.anilistID) fullURL += `?anilistID=${options.anilistID}`;
        if (options?.anilistInfo) fullURL += "?anilistInfo";

        return fullURL;
    },

    convertMediaPreviews: (data) => {
        if (data?.length > 0) {
            for (let i = 0; i < data.length; i++) {
                const matchResult = data[i];

                const videoPreview = new MediaPreview(matchResult.video);
                data[i].video = videoPreview

                const imagePreview = new MediaPreview(matchResult.image);
                data[i].image = imagePreview
            }
        };
    }
};