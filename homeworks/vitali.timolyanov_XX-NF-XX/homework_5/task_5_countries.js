const OTHER = 1;
const PEOPLE_IN_THE_WORLD = 7667435000;

const fs = require('fs');

function transform(inputCountries) {
    function convert(countries) {
        return countries.map((inCountry) => {
            const outCountry = {};
            if (typeof inCountry.Country === 'string' && typeof inCountry.Population === 'string') {
                outCountry.country = inCountry.Country;
                const population = Number.parseInt(inCountry.Population.split(',').join(''), 10);
                outCountry.percentValue = population / PEOPLE_IN_THE_WORLD * 100;
                outCountry.population = population;
            }
            return outCountry;
        });
    }

    function mergeOthers(countries) {
        const other = {
            country: 'Other',
            percentValue: 0,
            population: 0,
        };
        countries.forEach((element) => {
            other.percentValue += element.percentValue;
            other.population += element.population;
        });
        return other;
    }

    let outputCountries = convert(inputCountries);

    outputCountries.sort((left, right) => right.percentValue - left.percentValue);

    const others = outputCountries.filter(element => element.percentValue < OTHER);

    if (others.length >= 2) {
        outputCountries = outputCountries.filter(element => element.percentValue >= OTHER);
        outputCountries.push(mergeOthers(others));
    }
    console.log(outputCountries);
}

fs.readFile('./CountryCodes.json', (err, data) => {
    if (err) {
        throw err;
    }
    transform(JSON.parse(data.toString().trim()));
});
