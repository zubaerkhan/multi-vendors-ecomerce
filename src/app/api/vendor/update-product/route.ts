import { auth } from '@/auth'
import connectDB from '@/lib/connectDB'
import Product from '@/model/product.model'
import { NextRequest, NextResponse } from 'next/server'
import { deleteFromCloudinary, uploadOnCloudinary } from '@/lib/cloudinary'

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const session = await auth()
    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized User' },
        { status: 400 },
      )
    }

    const formData = await req.formData()
    const productId = formData.get('productId')
    const product = await Product.findById(productId)

    if (!product) {
      return NextResponse.json(
        { message: 'Product is not found' },
        { status: 400 },
      )
    }
    if (String(product.vendor) !== String(session.user.id)) {
      return NextResponse.json(
        { message: 'Not allowed to edit this product' },
        { status: 403 },
      )
    }
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

    if (!title || !description || !price || !stock || !category) {
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

    const newImages = formData.getAll('newImages')
    const oldImages = formData.getAll('oldImages')

    let finalImages: string[] = []

    // old images keep
    for (const img of oldImages) {
      if (typeof img === 'string') {
        finalImages.push(img)
      }
    }

    // upload new images
    for (const img of newImages) {
      if (img instanceof File) {
        const url = await uploadOnCloudinary(img)
        if (url) finalImages.push(url)
      }
    }

    // check minimum images
    if (finalImages.length !== 4) {
      return NextResponse.json(
        { message: 'Product must have exactly 4 images' },
        { status: 400 },
      )
    }

    const oldDBImages = product.images // old images

    // finalImages = new + old kept images

    const removedImages = oldDBImages.filter(
      (img: string) => !finalImages.includes(img),
    )

    // delete unused images
    await Promise.all(removedImages.map((img:string) => deleteFromCloudinary(img)))

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        title,
        description,
        price,
        stock,
        category,
        isStockAvailable: stock > 0,
        images: finalImages,
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
      },
      { new: true },
    )
    return NextResponse.json(
      { message: 'Product Updated Successfully', updatedProduct },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json(
      { message: `Failed to Updateroduct ${error} ` },
      { status: 500 },
    )
  }
}
