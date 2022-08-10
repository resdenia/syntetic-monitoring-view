const match = require('@menadevs/objectron');

const entryPattern = {
    pageref: /(?<pageRef>.*)/,
    startedDateTime: /(?<startedDateTime>.*)/,
    request: {
        method: /(?<requestMethod>GET|POST)/,
        url: /(?<requestUrl>[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*))/,
        httpVersion: /(?<requestHttpVersion>.*)/,
        headersSize: /^(?<requestHeaderSize>\-?(\d+\.?\d*|\d*\.?\d+))$/,
        bodySize: /^(?<requestHeaderSize>\-?(\d+\.?\d*|\d*\.?\d+))$/,
    },
    response: {
        status: /^(?<responseStatus>[0-9]{3})/,
        content: {
            size: /^(?<responseContentSize>\-?(\d+\.?\d*|\d*\.?\d+))$/,
        },
        headers: [
            { name: /^content-type$/i, value: /(?<responseContentType>.*)/ },
            {
                name: /^content-length$/i,
                value: /(?<responseContentLength>.*)/,
            },
            { name: /^cache-control$/i, value: /(?<responseCacheControl>.*)/ },
        ],
    },
    timings: (val) => val,
    time: /^(?<time>\-?(\d+\.?\d*|\d*\.?\d+))$/,
};

const convertHarToJSON = (harFile) => {
    let flatEntries = [];
    try {
        harFile.log.entries.forEach((entry, entryIndex) => {
            const currentEntry = match(entry, entryPattern);

            if (currentEntry.match) {
                const flatEntry = {
                    ...currentEntry.groups,
                    ...currentEntry.matches.timings,
                };

                if (entryIndex === 0) {
                    flatEntries.push(Object.keys(flatEntry));
                }

                flatEntries.push(Object.values(flatEntry));
            }
        });
        return { error: false, flatEntries };
    } catch (err) {
        console.log(err);
        return { error: true, message: 'Failed to convert Har file' };
    }
};

module.exports = convertHarToJSON;
