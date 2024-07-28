"use server";

import axios from 'axios';
import * as cheerio from 'cheerio';
import { extractCurrency, extractDescription, extractPrice } from '../utils';

export async function scrapeAmazonProduct(url: string) {
  if (!url) return null;

  const username = process.env.BRIGHT_DATA_USERNAME || '';
  const password = process.env.BRIGHT_DATA_PASSWORD || '';
  const port = 22225;
  const session_id = Math.floor(Math.random() * 1_000_000);

  const options = {
    auth: {
      username: `${username}-session-${session_id}`,
      password,
    },
    host: 'brd.superproxy.io',
    port,
    rejectUnauthorized: false,
  };

  try {
    // Add User-Agent header
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    };

    // Fetch the product page
    const response = await axios.get(url, { ...options, headers });
    const $ = cheerio.load(response.data);

    // Extract the product title
    const title = $('#productTitle').text().trim() || 'Unknown Title';

    // Extract the current and original prices
    const currentPrice = extractPrice(
      $('.priceToPay span.a-price-whole'),
      $('.a.size.base.a-color-price'),
      $('.a-button-selected .a-color-base')
    );

    const originalPrice = extractPrice(
      $('#priceblock_ourprice'),
      $('.a-price.a-text-price span.a-offscreen'),
      $('#listPrice'),
      $('#priceblock_dealprice'),
      $('.a-size-base.a-color-price')
    );

    const outOfStock = $('#availability span').text().trim().toLowerCase() === 'currently unavailable';

    const images = $('#imgBlkFront').attr('data-a-dynamic-image') || 
                    $('#landingImage').attr('data-a-dynamic-image') || 
                    '{}';

    const imageUrls = Object.keys(JSON.parse(images));
    const imageUrl = imageUrls.length > 0 ? imageUrls[0] : '';

    const currency = extractCurrency($('.a-price-symbol')) || '$';
    const discountRate = parseFloat($('.savingsPercentage').text().replace(/[-%]/g, "")) || 0;

    const description = extractDescription($) || 'No description available';

    // Construct data object with scraped information
    const data = {
      url,
      currency,
      image: imageUrl,
      title,
      currentPrice: parseFloat(currentPrice) || parseFloat(originalPrice) || 0,
      originalPrice: parseFloat(originalPrice) || parseFloat(currentPrice) || 0,
      priceHistory: [],
      discountRate,
      category: 'category', // Category extraction not implemented
      reviewsCount: 100, // Placeholder, consider extracting actual review count
      stars: 4.5, // Placeholder, consider extracting actual star rating
      isOutOfStock: outOfStock,
      description,
      lowestPrice: Math.min(parseFloat(currentPrice), parseFloat(originalPrice)) || 0,
      highestPrice: Math.max(parseFloat(currentPrice), parseFloat(originalPrice)) || 0,
      averagePrice: (parseFloat(currentPrice) + parseFloat(originalPrice)) / 2 || 0,
    };

    return data;
  } catch (error: any) {
    console.error(`Failed to scrape product at ${url}: ${error.response?.status} - ${error.message}`);
    return null;
  }
}

