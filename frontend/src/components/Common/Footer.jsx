import React from 'react'
import { Link } from 'react-router-dom'
import { TbBrandMeta } from 'react-icons/tb'
import { IoLogoInstagram } from 'react-icons/io'
import { FiPhoneCall } from 'react-icons/fi'
import { RiTwitterXLine } from 'react-icons/ri'
const Footer = () => {
  return (
    <footer className='border-t py-5'>
        <div className='container mx-auto grid grid-cols-1 px-10 md:grid-cols-4 gap-8  '>
            {/* Newsletter Signup */}
            <div>
                <h3 className='text-lg text-gray-800 mb-4'>Newsletter</h3>
                <p className='text-sm text-gray-600 mb-4'>Subscribe to our newsletter to get the latest updates.</p>
                <p className='font-medium text-sm text-gray-600 mb-6'>Signup and get 10% off on your first order.</p>
                {/* Newsletter form */}
                <form className='flex'>
                    <input type="email" placeholder='Enter your email' className='p-3 w-full text-sm border-t border-l border-b border-gray-300 rounded-l-md focus:outline-none 
                    focus:ring-2 focus:ring-gray-500 transition-all' required/>
                    <button type="submit" className='bg-TrendDrift-red text-white px-6 py-3 text-sm rounded-r-md hover:bg-[#017a96] transiton-all cursor-pointer'>Subscribe</button>
                </form>
            </div>

            {/* Shop links */}
            <div>
                <h3 className='text-lg text-gray-800 mb-4'>Shop</h3>
                <ul className='space-y-2 text-gray-600'>
                    <li>
                        <Link to="#" className="hover:text-gray-500 transition-colors">Men's Top Wear</Link>
                    </li>
                    <li>
                        <Link to="#" className="hover:text-gray-500 transition-colors">Women's Top Wear</Link>
                    </li>
                    <li>
                        <Link to="#" className="hover:text-gray-500 transition-colors">Men's Bottom Wear</Link>
                    </li>
                    <li>
                        <Link to="#" className="hover:text-gray-500 transition-colors">Women's Bottom Wear</Link>
                    </li>
                </ul>
            </div>

            {/* Support Links */}
             <div>
                <h3 className='text-lg text-gray-800 mb-4'>Support</h3>
                <ul className='space-y-2 text-gray-600'>
                    <li>
                        <Link to="#" className="hover:text-gray-500 transition-colors">Contact Us</Link>
                    </li>
                    <li>
                        <Link to="#" className="hover:text-gray-500 transition-colors">About Us</Link>
                    </li>
                    <li>
                        <Link to="#" className="hover:text-gray-500 transition-colors">FAQs</Link>
                    </li>
                    <li>
                        <Link to="#" className="hover:text-gray-500 transition-colors">Features</Link>
                    </li>
                </ul>
            </div>

            {/* Follow Us */}
            <div>
                <h3 className='text-lg text-gray-800 mb-4'>Follow Us</h3>
                <div className='flex items-center space-x-4 mb-6'>
                    <a href="https://wwww.facebook.com" target="_blank" rel='noopener noreferrer'
                    className='text-gray-600 hover:text-gray-800 transition-colors'>
                        <TbBrandMeta className='h-5 w-5' />
                    </a>
                    <a href="https://wwww.facebook.com" target="_blank" rel='noopener noreferrer'
                    className='text-gray-600 hover:text-gray-800 transition-colors'>
                        <IoLogoInstagram className='h-5 w-5' />
                    </a>
                    <a href="https://wwww.facebook.com" target="_blank" rel='noopener noreferrer'
                    className='text-gray-600 hover:text-gray-800 transition-colors'>
                        <RiTwitterXLine className='h-4 w-4' />
                    </a>
                </div>
                <p className='text-gray-500 '>Call Us</p>
                <p>
                    <FiPhoneCall className='inline-block mr-2' />
                    +91 97281-06553
                </p>
            </div>

        </div>

        {/* Footer Bottom */}
        <div className='container mx-auto mt-12 px-4 lg:px-0 border-t border-gray-200 pt-6'>
            <p className='text-gray-500 text-sm tracking-tighter text-center'>
                © 2025 TrendDrift. All rights reserved.
            </p>
        </div>
    </footer>
  )
}

export default Footer
