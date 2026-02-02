import { NextRequest, NextResponse } from "next/server";
import { getAdminFromToken } from "@/lib/auth";
import prisma from "@/lib/db";

interface EditItem {
  type: "setting" | "product" | "animal" | "post";
  id: string;
  field: string;
  value: string | number | boolean;
}

interface EditRequest {
  edits: EditItem[];
}

export async function POST(request: NextRequest) {
  const admin = await getAdminFromToken();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body: EditRequest = await request.json();
    const { edits } = body;

    if (!edits || !Array.isArray(edits) || edits.length === 0) {
      return NextResponse.json(
        { error: "No edits provided" },
        { status: 400 }
      );
    }

    const results: { success: boolean; key: string; error?: string }[] = [];

    for (const edit of edits) {
      const key = `${edit.type}:${edit.id}:${edit.field}`;

      try {
        switch (edit.type) {
          case "setting": {
            // For settings, the 'id' is the setting key
            const type =
              typeof edit.value === "number"
                ? "number"
                : typeof edit.value === "boolean"
                ? "boolean"
                : "string";

            await prisma.setting.upsert({
              where: { key: edit.id },
              update: { value: String(edit.value), type },
              create: { key: edit.id, value: String(edit.value), type },
            });
            results.push({ success: true, key });
            break;
          }

          case "product": {
            // Handle product updates
            const productUpdate: Record<string, unknown> = {};

            // Handle special case for images array (e.g., "images[0]")
            if (edit.field.startsWith("images[")) {
              const indexMatch = edit.field.match(/images\[(\d+)\]/);
              if (indexMatch) {
                const index = parseInt(indexMatch[1], 10);
                // Fetch current images
                const product = await prisma.product.findUnique({
                  where: { id: edit.id },
                  select: { images: true },
                });

                if (product) {
                  // Parse images from JSON string
                  let images: string[] = [];
                  try {
                    images = product.images ? JSON.parse(product.images) : [];
                  } catch {
                    images = [];
                  }
                  // Ensure array is large enough
                  while (images.length <= index) {
                    images.push("");
                  }
                  images[index] = String(edit.value);
                  // Store back as JSON string
                  productUpdate.images = JSON.stringify(images);
                }
              }
            } else {
              // Regular field update
              productUpdate[edit.field] = edit.value;
            }

            if (Object.keys(productUpdate).length > 0) {
              await prisma.product.update({
                where: { id: edit.id },
                data: productUpdate,
              });
            }
            results.push({ success: true, key });
            break;
          }

          case "animal": {
            // Handle animal updates
            const animalUpdate: Record<string, unknown> = {};
            animalUpdate[edit.field] = edit.value;

            await prisma.animal.update({
              where: { id: edit.id },
              data: animalUpdate,
            });
            results.push({ success: true, key });
            break;
          }

          case "post": {
            // Handle blog post updates
            const postUpdate: Record<string, unknown> = {};
            postUpdate[edit.field] = edit.value;

            await prisma.blogPost.update({
              where: { id: edit.id },
              data: postUpdate,
            });
            results.push({ success: true, key });
            break;
          }

          default:
            results.push({
              success: false,
              key,
              error: `Unknown content type: ${edit.type}`,
            });
        }
      } catch (error) {
        console.error(`Error updating ${key}:`, error);
        results.push({
          success: false,
          key,
          error: error instanceof Error ? error.message : "Update failed",
        });
      }
    }

    const successCount = results.filter((r) => r.success).length;
    const errors = results.filter((r) => !r.success);

    return NextResponse.json({
      success: errors.length === 0,
      updated: successCount,
      total: edits.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Inline edit error:", error);
    return NextResponse.json(
      { error: "Failed to process edits" },
      { status: 500 }
    );
  }
}
