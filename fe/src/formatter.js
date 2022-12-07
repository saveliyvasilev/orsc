const locale = "en-US";

export const currencyFormat = (value) =>
    new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "USD",
        notation: "compact",
    }).format(value.toFixed(2));

export const barrelFormat = (value) =>
    new Intl.NumberFormat(locale, {
        notation: "compact",
    }).format(value.toFixed(2));

export const assayFormat = (value) =>
    new Intl.NumberFormat(locale, {
        notation: "compact",
    }).format(value.toFixed(2));

export const percentFormat = (value, decimals) =>
    new Intl.NumberFormat(locale, {
        style: "percent",
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value);
