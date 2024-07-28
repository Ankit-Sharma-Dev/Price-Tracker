import { PriceHistoryItem, Product } from "@/types";

const Notification = {
  WELCOME: 'WELCOME',
  CHANGE_OF_STOCK: 'CHANGE_OF_STOCK',
  LOWEST_PRICE: 'LOWEST_PRICE',
  THRESHOLD_MET: 'THRESHOLD_MET',
};

const THRESHOLD_PERCENTAGE = 40;

export function extractPrice(...elements: any) {
  for (const element of elements) {
    const priceText = element.text().trim();

    if (priceText) {
      const cleanPrice = priceText.replace(/[^\d.,]/g, ''); // Handle different formats

      // Use a regular expression to capture the price correctly
      const priceMatch = cleanPrice.match(/\d+[\.,]\d{2}/);
      const firstPrice = priceMatch ? priceMatch[0].replace(',', '.') : cleanPrice;

      return firstPrice;
    }
  }

  return '';
}

// Extracts and returns the currency symbol from an element.
export function extractCurrency(element: any) {
  const currencyText = element.text().trim();
  return currencyText ? currencyText.slice(0, 1) : ""; // Handle different currencies
}

// Extracts description from possible elements from Amazon
export function extractDescription($: any) {
  const selectors = [
    ".a-unordered-list .a-list-item",
    ".a-expander-content p",
    // Add more selectors here if needed
  ];

  for (const selector of selectors) {
    const elements = $(selector);
    if (elements.length > 0) {
      return elements
        .map((_: any, element: any) => $(element).text().trim())
        .get()
        .join("\n");
    }
  }

  return "";
}

export function getHighestPrice(priceList: PriceHistoryItem[]) {
  if (priceList.length === 0) return 0;
  return Math.max(...priceList.map(item => item.price));
}

export function getLowestPrice(priceList: PriceHistoryItem[]) {
  if (priceList.length === 0) return 0;
  return Math.min(...priceList.map(item => item.price));
}

export function getAveragePrice(priceList: PriceHistoryItem[]) {
  if (priceList.length === 0) return 0;
  const sumOfPrices = priceList.reduce((acc, curr) => acc + curr.price, 0);
  return sumOfPrices / priceList.length;
}

export const getEmailNotifType = (
  scrapedProduct: Product,
  currentProduct: Product
) => {
  const lowestPrice = getLowestPrice(currentProduct.priceHistory);

  if (scrapedProduct.currentPrice < lowestPrice) {
    return Notification.LOWEST_PRICE;
  }
  if (!scrapedProduct.isOutOfStock && currentProduct.isOutOfStock) {
    return Notification.CHANGE_OF_STOCK;
  }
  if (scrapedProduct.discountRate >= THRESHOLD_PERCENTAGE) {
    return Notification.THRESHOLD_MET;
  }

  return null;
};

export const formatNumber = (num: number = 0) => {
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};
