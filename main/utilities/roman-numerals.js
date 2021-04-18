import pkg from 'roman-numerals';
const
    arabic = pkg.toArabic,
    roman = pkg.toRoman

function toDecimal(roman) {
    return arabic(roman);
}

function toRoman(number) {
    return roman(number);
}

export { toDecimal, toRoman };