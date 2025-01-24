export function formatToDecimals(value, decimals = 2) {
  if (value == null || isNaN(value)) {
    return "0".padEnd(decimals + 2, "0");
  }
  return Number(value).toFixed(decimals);
}

export function formatWithThousandSeparator(value, decimals = 2) {
  if (value == null || isNaN(value)) {
    return "0";
  }
  const [integer, decimal] = Number(value).toFixed(decimals).split(".");
  const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decimal ? `${formattedInteger}.${decimal}` : formattedInteger;
}

export function formatCurrency(value, currencySymbol = "$", locale = "en-US", decimals = 2) {
  if (value == null || isNaN(value)) {
    return `${currencySymbol}0`.padEnd(decimals + 3, "0");
  }
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencySymbol === "$" ? "USD" : currencySymbol,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatPercentage(value, decimals = 2) {
  if (value == null || isNaN(value)) {
    return "0".padEnd(decimals + 3, "0") + "%";
  }
  return `${Number(value).toFixed(decimals)}%`;
}