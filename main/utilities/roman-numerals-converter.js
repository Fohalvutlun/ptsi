import pkg from 'roman-numerals';

const { toArabic, toRoman } = pkg;

function toDecimalConverter(roman) {
    const { converted, valid } = attemptConversion(roman, toArabic);

    return Object.freeze({
        getDecimal: () => converted,
        isValid: () => valid
    });
}

function toRomanConverter(decimal) {
    const { converted, valid } = attemptConversion(decimal, toRoman);

    return Object.freeze({
        getRoman: () => converted,
        isValid: () => valid
    });
}

function attemptConversion(value, conversionFunc) {
    try {
        return {
            converted: conversionFunc(value),
            valid: true
        };
    } catch (err) {
        if (err instanceof TypeError) {
            return {
                converted: null,
                valid: true
            };
        } else {
            throw err;
        }
    }
}

export { toDecimalConverter, toRomanConverter };