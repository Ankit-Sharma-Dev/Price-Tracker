import { NextResponse } from "next/server";
import { getLowestPrice, getHighestPrice, getAveragePrice, getEmailNotifType } from "@/lib/utils";
import { connectToDB } from "@/lib/mongoose";
import Product from "@/lib/models/product.model";
import { scrapeAmazonProduct } from "@/lib/scraper";
import { generateEmailBody, sendEmail } from "@/lib/nodemailer";
import { NotificationType } from "@/types";

export const maxDuration = 300; // This function can run for a maximum of 300 seconds
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    // Ensure DB connection
    await connectToDB();

    // Fetch all products
    const products = await Product.find({});
    if (!products || products.length === 0) {
      return NextResponse.json({ message: "No products found" }, { status: 404 });
    }

    // Scrape latest product details and update DB
    const updatedProducts = await Promise.all(
      products.map(async (currentProduct) => {
        try {
          // Scrape product
          const scrapedProduct = await scrapeAmazonProduct(currentProduct.url);
          if (!scrapedProduct) {
            console.warn(`Scraping failed for product with URL: ${currentProduct.url}`);
            return null;
          }

          // Update price history
          const updatedPriceHistory = [
            ...currentProduct.priceHistory,
            { price: scrapedProduct.currentPrice },
          ];

          const product = {
            ...scrapedProduct,
            priceHistory: updatedPriceHistory,
            lowestPrice: getLowestPrice(updatedPriceHistory),
            highestPrice: getHighestPrice(updatedPriceHistory),
            averagePrice: getAveragePrice(updatedPriceHistory),
          };

          // Update product in DB
          const updatedProduct = await Product.findOneAndUpdate(
            { url: product.url },
            product,
            { new: true } // Return the updated document
          );

          if (!updatedProduct) {
            console.warn(`Update failed for product with URL: ${product.url}`);
            return null;
          }

          // Check status and send email if necessary
          const emailNotifType = getEmailNotifType(scrapedProduct, currentProduct);
          if (emailNotifType && updatedProduct.users.length > 0) {
            const productInfo = {
              title: updatedProduct.title,
              url: updatedProduct.url,
            };

            // Use type assertion to inform TypeScript that emailNotifType is valid
            const emailContent = await generateEmailBody(productInfo, emailNotifType as NotificationType);
            const userEmails = updatedProduct.users.map((user: any) => user.email);
            await sendEmail(emailContent, userEmails);
          }

          return updatedProduct;
        } catch (error) {
          console.error(`Error processing product with URL: ${currentProduct.url}`, error);
          return null;
        }
      })
    );

    return NextResponse.json({
      message: "Products processed successfully",
      data: updatedProducts.filter(product => product !== null),
    });
  } catch (error: any) {
    console.error('Failed to get all products:', error);
    return NextResponse.json({
      message: `Failed to get all products: ${error.message}`
    }, { status: 500 });
  }
}
