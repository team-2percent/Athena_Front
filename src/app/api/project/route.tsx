import { NextRequest, NextResponse } from "next/server";

export function GET(request: NextRequest){
  return NextResponse.json(9007199254740991);
}

export async function POST(request: NextRequest) {
  const requiredKeys = [
    "sellerId",
    "categoryId",
    "imageGroupId",
    "title",
    "description",
    "goalAmount",
    "contentMarkdown",
    "startAt",
    "endAt",
    "shippedAt",
    "products",
  ];

  const body = await request.json();

  for (const key of requiredKeys) {
    if (!body[key]) {
      return NextResponse.json({ error: `${key} is missing` }, { status: 400 });
    }
  }

  if (!Array.isArray(body.products) || body.products.length === 0) {
    return NextResponse.json({ error: "products must be a non-empty array" }, { status: 400 });
  }

  for (const product of body.products) {
    const productKeys = ["name", "description", "price", "stock", "options"];
    for (const key of productKeys) {
      if (!product[key]) {
        return NextResponse.json({ error: `Product ${key} is missing` }, { status: 400 });
      }
    }

    if (!Array.isArray(product.options)) {
      return NextResponse.json({ error: "Product options must be an array" }, { status: 400 });
    }
  }

  return NextResponse.json({
    "projectId": 9007199254740991,
    "imageGroupId": 9007199254740991
  });
}