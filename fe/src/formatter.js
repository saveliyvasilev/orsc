const locale = "en-US";

export const currencyFormat = (value) =>
    new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "USD",
        notation: "compact",
    }).format(value);

export const barrelFormat = (value) =>
    new Intl.NumberFormat(locale, {
        notation: "compact",
    }).format(value);

export const assayFormat = (value) =>
    new Intl.NumberFormat(locale, {
        notation: "compact",
    }).format(value);
