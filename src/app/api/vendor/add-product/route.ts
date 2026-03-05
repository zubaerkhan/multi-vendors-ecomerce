import { auth } from '@/auth'
import { uploadOnCloudinary } from '@/lib/cloudinary'

import connectDB from '@/lib/connectDB'
import Product from '@/model/product.model'
import User from '@/model/user.model'
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

    const formData = await req.formData()
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const price = Number(formData.get('price'))
    const stock = Number(formData.get('stock'))
    const category = formData.get('category') as string
    const isWearable = formData.get('isWearable') === 'true'
    const sizes = formData.getAll('sizes')
    const replacementDays = Number(formData.get('replacementDays') || 0)
    const freeDelivery = formData.get('freeDelivery') === 'true'
    const warranty = (formData.get('warranty') as string) || 'No Warranty'
    const payOnDelivery = formData.get('payOnDelivery') === 'true'
    const detailsPoints = formData.getAll('detailsPoints')
    const images = formData.getAll('images')

    if (!title || !description || !price || !stock || !category || !images) {
      return NextResponse.json(
        { message: 'All fields & 4 images required' },
        { status: 400 },
      )
    }
    if (isWearable && sizes.length === 0) {
      return NextResponse.json(
        { message: 'Sizes are required for wearble Product' },
        { status: 400 },
      )
    }

    const checkImages: File[] = []
    for (const img of images) {
      if (img instanceof File) {
        checkImages.push(img)
      }
    }

    if (checkImages.length !== 4) {
      return NextResponse.json(
        { message: `Please upload exactly 4 images. (${4-checkImages.length }) More Images` },
        { status: 400 },
      )
    }

    const uploadedImages: string[] = []

    for (const img of images) {
      if (img instanceof File) {
        const url = await uploadOnCloudinary(img)
        if (url) uploadedImages.push(url)
      }
    }

    const product = await Product.create({
      title,
      description,
      price,
      stock,
      category,
      isStockAvailable: stock > 0,
      images: uploadedImages,
      vendor: session.user.id,
      isWearable,
      sizes: isWearable ? sizes : [],
      replacementDays,
      warranty,
      payOnDelivery,
      freeDelivery,
      detailsPoints,
      rejectedReason: null,
      verificationStatus: 'pending',
      isActive: false,
    })

    await User.findByIdAndUpdate(
      session.user.id,
      {
        $push: { vendorProducts: product._id },
      },
      { new: true },
    )
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { message: `Failed to create new product ${error} ` },
      { status: 500 },
    )
  }
}
