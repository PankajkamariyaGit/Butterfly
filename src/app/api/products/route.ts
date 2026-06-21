import { NextRequest, NextResponse } from "next/server";
import { query, execute } from "@/lib/db";

interface ProductRow {
  id: string;
  name: string;
  slug: string;
  price: number;
  discount_price: number;
  category: string;
  category_slug: string;
  stock: number;
  badge: string | null;
  description: string;
  material: string;
  care_instructions: string;
  rating: number;
  review_count: number;
  featured: number;
  bestseller: number;
  new_arrival: number;
  active: number;
  sku: string;
  tags: string;
  video_url: string;
}

interface ImageRow {
  image_url: string;
}

// GET all products
export async function GET() {
  try {
    const products = await query<ProductRow>("SELECT * FROM products ORDER BY created_at DESC");

    const result = await Promise.all(
      products.map(async (p) => {
        const images = await query<ImageRow>(
          "SELECT image_url FROM product_images WHERE product_id = ? ORDER BY sort_order",
          [p.id]
        );
        return {
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: Number(p.price),
          discountPrice: Number(p.discount_price),
          category: p.category,
          categorySlug: p.category_slug,
          stock: p.stock,
          badge: p.badge,
          description: p.description,
          material: p.material,
          careInstructions: p.care_instructions,
          images: images.map((i) => i.image_url),
          rating: Number(p.rating),
          reviewCount: p.review_count,
          featured: Boolean(p.featured),
          bestseller: Boolean(p.bestseller),
          newArrival: Boolean(p.new_arrival),
          active: Boolean(p.active),
          sku: p.sku,
          tags: typeof p.tags === "string" ? JSON.parse(p.tags) : p.tags || [],
          videoUrl: p.video_url,
        };
      })
    );

    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST - create a new product
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const id = body.id || `p-${Date.now()}`;
    const slug = body.slug || body.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    await execute(
      `INSERT INTO products (id, name, slug, price, discount_price, category, category_slug, stock, badge, description, material, care_instructions, featured, bestseller, new_arrival, active, sku, tags, video_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, body.name, slug, body.price, body.discountPrice || 0,
        body.category, body.categorySlug, body.stock || 0, body.badge || null,
        body.description || "", body.material || "", body.careInstructions || "",
        body.featured ? 1 : 0, body.bestseller ? 1 : 0, body.newArrival ? 1 : 0,
        body.active !== false ? 1 : 0, body.sku || "",
        JSON.stringify(body.tags || []), body.videoUrl || "",
      ]
    );

    // Insert images
    if (body.images && body.images.length > 0) {
      for (let i = 0; i < body.images.length; i++) {
        if (body.images[i]?.trim()) {
          await execute(
            "INSERT INTO product_images (product_id, image_url, sort_order) VALUES (?, ?, ?)",
            [id, body.images[i], i]
          );
        }
      }
    }

    return NextResponse.json({ success: true, id });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT - update a product
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    const slug = body.slug || body.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    await execute(
      `UPDATE products SET name=?, slug=?, price=?, discount_price=?, category=?, category_slug=?, stock=?, badge=?, description=?, material=?, care_instructions=?, featured=?, bestseller=?, new_arrival=?, active=?, sku=?, tags=?, video_url=? WHERE id=?`,
      [
        body.name, slug, body.price, body.discountPrice || 0,
        body.category, body.categorySlug, body.stock || 0, body.badge || null,
        body.description || "", body.material || "", body.careInstructions || "",
        body.featured ? 1 : 0, body.bestseller ? 1 : 0, body.newArrival ? 1 : 0,
        body.active !== false ? 1 : 0, body.sku || "",
        JSON.stringify(body.tags || []), body.videoUrl || "", id,
      ]
    );

    // Replace images
    await execute("DELETE FROM product_images WHERE product_id = ?", [id]);
    if (body.images && body.images.length > 0) {
      for (let i = 0; i < body.images.length; i++) {
        if (body.images[i]?.trim()) {
          await execute(
            "INSERT INTO product_images (product_id, image_url, sort_order) VALUES (?, ?, ?)",
            [id, body.images[i], i]
          );
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE - remove a product
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    await execute("DELETE FROM products WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
