import { auth } from '@/auth'
import { uploadOnCloudinary } from '@/lib/cloudinary'
import connectDB from '@/lib/connectDB'
import Product from '@/model/product.model'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const session = await auth()
    if (!session || !session?.user?.email || !session?.user.id) {
      return NextResponse.json(
        { message: 'UnAuthorized User' },
        { status: 400 },
      )
    }
    const userId = session?.user?.id
    const formData = await req.formData()
    const productId = formData.get('productId') as string
    const rating = Number(formData.get('rating'))
    const comment = formData.get('comment') as string
    const images = formData.getAll('images')

    if (!productId) {
      return NextResponse.json(
        { message: 'Product Id is required' },
        { status: 400 },
      )
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { message: 'Rating must be between 1 to 5' },
        { status: 400 },
      )
    }

    if (!comment || comment.trim().length === 0) {
      return NextResponse.json(
        { message: 'Comment is required' },
        { status: 400 },
      )
    }
    const product = await Product.findById(productId)
    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 400 },
      )
    }

    if (images.length > 6) {
      return NextResponse.json(
        {
          message: `Please upload less than 5 images.`,
        },
        { status: 400 },
      )
    }

    // const uploadedImages: string[] = []

    // for (const img of images) {
    //   if (img && typeof img === 'object') {
    //     const url = await uploadOnCloudinary(img as File)
    //     if (url) uploadedImages.push(url)
    //   }
    // }

    const uploadedImages: string[] = []

    for (const img of images) {
      if (img instanceof File) {
        const url = await uploadOnCloudinary(img)
        if (url) uploadedImages.push(url)
      }
    }

    product.reviews.push({
      user: userId,
      rating,
      comment,
      images: uploadedImages || [],
    })

    await product.save()

    return NextResponse.json(
      { message: 'Review added successfully' },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json(
      { message: `Failed to Add Review ${error} ` },
      { status: 500 },
    )
  }
}
