import connectDB from '@/lib/connectDB'
import Product from '@/model/product.model'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)

    const query = searchParams.get('query')?.trim() || ''
    const category = searchParams.get('category')?.trim()
    const shop = searchParams.get('shop')?.trim()

    const filter: any = {
      isActive: true,
      verificationStatus: 'approved',
    }

    const andConditions: any[] = []

    // 🔎 search
    if (query) {
      andConditions.push({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { category: { $regex: query, $options: 'i' } },
        ],
      })
    }

    // 📦 category (exact match - faster than regex)
    if (category && category !== 'all') {
      andConditions.push({
        category: category,
      })
    }

    // 🏪 shop
    if (shop && shop !== 'all') {
      andConditions.push({
        vendor: shop,
      })
    }

    // combine filters
    if (andConditions.length > 0) {
      filter.$and = andConditions
    }

    const products = await Product.find(filter)
      .populate('vendor')
      .sort({ createdAt: -1 }) // newest first

    return NextResponse.json(
      {
        success: true,
        count: products.length,
        products,
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: `Failed to find product section`,
      },
      { status: 500 }
    )
  }
}