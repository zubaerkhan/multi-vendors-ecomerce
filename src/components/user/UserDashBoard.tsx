import Slider from './Slider'
import CategorySlider from './CategorySlider'
import ProductCardPage from './ProductCardPage'

export default function UserDashBoard() {
  return (
    <div className='w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 font-sans p-2 '>
        <Slider/>
        <CategorySlider/>
        <ProductCardPage/>
    </div>
  )
}
