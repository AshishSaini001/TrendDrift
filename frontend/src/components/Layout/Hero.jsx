import React from 'react'
import { Link } from 'react-router-dom'
import heroImg from '../../assets/rabbit-hero.jpg'
const Hero = () => {
  return (
    <section className='relative mt-[-11px]' style={{ backgroundImage: `url(${heroImg})`, backgroundSize: 'cover', backgroundPosition: 'top' }}>
        <div className='min-h-[400px] md:min-h-[600px] flex items-center ml-20'>
            <div className='text-white p-8 md:pl-20 pt-[120px] md:pt-0 max-w-xl'>
                <h1 className='text-4xl md:text-8xl font-bold tracking-tighter uppercase mb-4'>Vacation <br /> Ready
                </h1>
                <p className='text-sm md:text-lg mb-6'>
                    Explore Our Vacation-ready outfits with fast worldwide shipping.
                </p>
                <Link to="#" className="bg-white text-gray-950 px-6 py-2 rounded-sm text-lg hover:bg-gray-100 transition">Shop Now</Link>
            </div>
        </div>
    </section>
  )
}

export default Hero
