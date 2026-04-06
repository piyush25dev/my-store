//app/api/products/[slug]/route.js
// This API route fetches detailed product information based on the slug provided in the URL.
// It retrieves the main product data along with all related information such as variants, images, FAQs, highlights, details, and reviews.
// The slug is extracted from the URL parameters, and the product is fetched from the Supabase database.
// If the product is found, it returns a comprehensive JSON response containing all relevant data. If not found or if an error occurs, it returns an appropriate error message.
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

/**
 * GET /api/products/[slug]
 * Fetch detailed product information by slug
 *
 * Fix: Properly extract slug from params
 */
export async function GET(request, { params }) {
  try {
    // Wait for params to be available (important in Next.js 13+)
    const { slug } = await Promise.resolve(params);

    console.log("=== PRODUCT DETAIL API ===");
    console.log("Raw params:", params);
    console.log("Slug value:", slug);
    console.log("Slug type:", typeof slug);

    if (!slug) {
      console.error("ERROR: Slug is missing or empty");
      return NextResponse.json(
        { error: "Slug parameter is required", params: JSON.stringify(params) },
        { status: 400 },
      );
    }

    console.log("Fetching product with slug:", slug);

    // Fetch product
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (productError) {
      console.error("Supabase product error:", productError.message);
      return NextResponse.json(
        { error: "Product not found", details: productError.message },
        { status: 404 },
      );
    }

    if (!product) {
      console.error("No product found for slug:", slug);
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    console.log("✓ Product found:", product.id, product.name);

    // Fetch all related data in parallel
    console.log("Fetching related data...");

    const [
      { data: variants, error: variantError },
      { data: images, error: imageError },
      { data: faqs, error: faqError },
      { data: highlights, error: highlightError },
      { data: details, error: detailError },
      { data: reviews, error: reviewError },
    ] = await Promise.all([
      supabase
        .from("product_variants")
        .select("*")
        .eq("product_id", product.id)
        .order("display_order", { ascending: true }),

      supabase
        .from("product_images")
        .select("*")
        .eq("product_id", product.id)
        .order("display_order", { ascending: true }),

      supabase
        .from("product_faqs")
        .select("*")
        .eq("product_id", product.id)
        .order("display_order", { ascending: true }),

      supabase
        .from("product_highlights")
        .select("*")
        .eq("product_id", product.id)
        .order("display_order", { ascending: true }),

      supabase
        .from("product_details")
        .select("*")
        .eq("product_id", product.id)
        .order("display_order", { ascending: true }),

      supabase
        .from("product_reviews")
        .select("*")
        .eq("product_id", product.id)
        .eq("review_status", "approved"),
    ]);

    // Log any errors from related data
    if (variantError) console.warn("Variants error:", variantError.message);
    if (imageError) console.warn("Images error:", imageError.message);
    if (faqError) console.warn("FAQs error:", faqError.message);
    if (highlightError)
      console.warn("Highlights error:", highlightError.message);
    if (detailError) console.warn("Details error:", detailError.message);
    if (reviewError) console.warn("Reviews error:", reviewError.message);

    // Log counts
    console.log("Data counts:", {
      variants: variants?.length || 0,
      images: images?.length || 0,
      faqs: faqs?.length || 0,
      highlights: highlights?.length || 0,
      details: details?.length || 0,
      reviews: reviews?.length || 0,
    });

    // Calculate review stats
    const avgRating =
      reviews && reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    // Construct response
    const fullProduct = {
      ...product,
      price: product.price ? product.price  : null, 
      original_price: product.original_price
        ? product.original_price 
        : null, 
       product_variants: variants?.map((v) => ({
        ...v,
        price_modifier: v.price_modifier ? v.price_modifier  : 0,
      })) || [],
      product_images: images || [],
      product_faqs: faqs || [],
      product_highlights: highlights || [],
      product_details: details || [],
      product_reviews: reviews || [],
      average_rating: parseFloat(avgRating.toFixed(1)),
    };

    console.log("✓ Returning full product with", images?.length || 0, "images");
    console.log("=== END PRODUCT DETAIL API ===");

    return NextResponse.json({ product: fullProduct });
  } catch (error) {
    console.error("=== API ERROR ===");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);

    return NextResponse.json(
      {
        error: "Failed to fetch product",
        message: error.message,
        details:
          process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}
