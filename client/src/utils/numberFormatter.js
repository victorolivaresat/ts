const formatToDecimals = (value, decimals = 2) => {
  value == null || isNaN(value)
    ? "0".padEnd(decimals + 2, "0")
    : Number(value).toFixed(decimals);
};

const formatWithThousandSeparator = (value, decimals = 2) => {
  if (value == null || isNaN(value)) {
    return "0";
  }
  const [integer, decimal] = Number(value).toFixed(decimals).split(".");
  const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decimal ? `${formattedInteger}.${decimal}` : formattedInteger;
};

const formatCurrency = (
  value,
  currencySymbol = "$",
  locale = "en-US",
  decimals = 2
) => {
  value == null || isNaN(value)
    ? `${currencySymbol}0`.padEnd(decimals + 3, "0")
    : new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currencySymbol === "$" ? "USD" : currencySymbol,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(value);
};

const formatPercentage = (value, decimals = 2) => {
  value == null || isNaN(value)
    ? "0".padEnd(decimals + 3, "0") + "%"
    : `${Number(value).toFixed(decimals)}%`;
};

export {
  formatToDecimals,
  formatWithThousandSeparator,
  formatCurrency,
  formatPercentage,
};
