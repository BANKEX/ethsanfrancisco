const course = {
    getCourse: async (currency) => {
        console.log($)
        const response = await $.get({
            url: `https://min-api.cryptocompare.com/data/price?fsym=${currency}&tsyms=WAVES,BTC,ETH,ZEC,LTC,USD,EUR,RUB`,
            type: 'GET',
        });
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
        const courses = await _utils.course.getCourse(currency[from].ticker);
        console.log(courses)
        const rate = courses[currency[to].ticker];
        const result = value * rate;
        return result * 1000 % 10 === 0 ? result : result.toFixed(2);
    }
}

module.exports = {
    course: course
}

