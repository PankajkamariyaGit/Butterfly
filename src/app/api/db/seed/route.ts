import { NextResponse } from "next/server";
import { execute, query } from "@/lib/db";
import { PRODUCTS } from "@/lib/data";

// POST - seed database with existing hardcoded products
export async function POST() {
  try {
    // Check if products already exist
    const existing = await query<{ cnt: number }>("SELECT COUNT(*) as cnt FROM products");
    if (existing[0]?.cnt > 0) {
      return NextResponse.json({ message: `Database already has ${existing[0].cnt} products. Skipping seed.` });
    }

    for (const p of PRODUCTS) {
      await execute(
        `INSERT INTO products (id, name, slug, price, discount_price, category, category_slug, stock, badge, description, material, care_instructions, rating, review_count, featured, bestseller, new_arrival, active, sku, tags, video_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          p.id, p.name, p.slug, p.price, p.discountPrice,
          p.category, p.categorySlug, p.stock, p.badge,
          p.description, p.material, p.careInstructions,
          p.rating, p.reviewCount,
          p.featured ? 1 : 0, p.bestseller ? 1 : 0, p.newArrival ? 1 : 0,
          p.active ? 1 : 0, p.sku, JSON.stringify(p.tags), "",
        ]
      );

      for (let i = 0; i < p.images.length; i++) {
        await execute(
          "INSERT INTO product_images (product_id, image_url, sort_order) VALUES (?, ?, ?)",
          [p.id, p.images[i], i]
        );
      }
    }

    return NextResponse.json({ success: true, message: `Seeded ${PRODUCTS.length} products` });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
