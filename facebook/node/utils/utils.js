const rp = require('request-promise');

const currency = {
    "Bitcoin": {
        "ticker": "BTC"
    },
    "Ethereum": {
        "ticker": "ETH"
    },
    "US_Dollar": {
        "ticker": "USD"
    }
}

const course = {
    getCourse: async (currency) => {
        var options = {
            method: 'GET',
            uri: `https://min-api.cryptocompare.com/data/price?fsym=${currency}&tsyms=BTC,ETH,USD`,
            json: true
        };
        const response = await rp(options);
        return response;
    },
    /**
     * Allows to convert currencies
     * @param from Currency that will be changed
     * @param to Destination currency
     * @param value Amount of currency that will be changed
     * @returns {Promise<number>}
     */
    convert: async (from, to, value) => {
        const courses = await course.getCourse(from);
        console.log(courses)
        const rate = courses[to];
        const result = value * rate;
        return result * 1000 % 10 === 0 ? result : result.toFixed(2);
    }
}

module.exports = {
    course: course,
}

