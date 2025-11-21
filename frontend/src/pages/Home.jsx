import React from 'react'
import Hero from '../components/Layout/Hero.jsx'
import GenderCollectionSection from '../components/Products/GenderCollectionSection.jsx'
import NewArrivals from '../components/Products/NewArrivals.jsx'
import ProductDetails from '../components/Products/ProductDetails.jsx'
import ProductGrid from '../components/Products/ProductGrid.jsx'
import FeaturedCollection from '../components/Products/FeaturedCollection.jsx'
import FeaturesSection from '../components/Products/FeaturesSection.jsx'

const placeholderProducts =  [
    {
        _id:1,
        name: "Casual Blue Jeans",
        price: 49.99,
        images:[
            {
            url: "https://picsum.photos/500/500/?random=21",
            altText: "Casual Blue Jeans Image"
            }
        ]
    },
    {
        _id:2,
        name: "Red Hoodie",
        price: 39.99,
        images:[
            {
            url: "https://picsum.photos/500/500/?random=22",
            altText: "Red Hoodie Image"
            }
        ]
    },
    {
        _id:3,
        name: "Black Sneakers",
        price: 59.99,
        images:[
            {
            url: "https://picsum.photos/500/500/?random=23",
            altText: "Black Sneakers Image" 
            }
        ]
    },
    {
        _id:4,
        name: "Leather Belt",       
        price: 24.99,
        images:[
            {
            url: "https://picsum.photos/500/500/?random=24",
            altText: "Leather Belt Image"
            }
        ]
    },
    {
        _id:5,
        name: "Summer Dress",
        price: 59.99,
        images:[
            {
            url: "https://picsum.photos/500/500/?random=25",
            altText: "Summer Dress Image"
            }
        ]
    },
    {
        _id:6,
        name: "Running Shoes",
        price: 89.99,
        images:[  
            {
            url: "https://picsum.photos/500/500/?random=26",
            altText: "Running Shoes Image"
            }
        ]
    },
    {
        _id:7,
        name: "Formal Shirt",
        price: 45.99,
        images:[
            {
            url: "https://picsum.photos/500/500/?random=27",
            altText: "Formal Shirt Image"
            }
        ]
    },
    {
        _id:8,
        name: "Denim Jacket",
        price: 79.99,
        images:[
            {
            url: "https://picsum.photos/500/500/?random=28",
            altText: "Denim Jacket Image"
            }
        ]
    }
]



const Home = () => {
  return (
    <div>
      <Hero />
      <GenderCollectionSection />
      <NewArrivals />
      <h2 className='text-3xl text-center  font-bold mb-4'> 
        Best Seller
      </h2>
      <ProductDetails />
      <div className='container mx-auto px-10 '>
          <h2 className='text-3xl text-center font-bold mb-4'>
            Top Wears for Women
          </h2>
          <ProductGrid products={placeholderProducts} />
      </div>
      <FeaturedCollection />
      <FeaturesSection />
    </div>

  )
}

export default Home
