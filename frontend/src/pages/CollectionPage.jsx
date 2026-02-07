import React, { useEffect,useRef } from 'react'
import { FaFilter } from 'react-icons/fa';
import { useState } from 'react';
import FilterSidebar from '../components/Products/FilterSidebar';
import SortOptions from '../components/Products/SortOptions';
import ProductGrid from '../components/Products/ProductGrid';
const CollectionPage = () => {
  const [products, setProducts] = useState([]);
  const sidebarRef =useRef(null);
  const [isSidebarOpen,setIsSidebarOpen]=useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  }
    const handleClickOutSide =(event)=>{
        if(sidebarRef.current && !sidebarRef.current.contains(event.target)){
            setIsSidebarOpen(false);
        }
    }
  useEffect(() => {
    document.addEventListener("mousedown",handleClickOutSide);
    // Cleanup the event listener on component unmount
    return ()=>{
        document.removeEventListener("mousedown",handleClickOutSide);
    }
    

  });

  useEffect(() => {
    // Simulate fetching products from an API
    setTimeout(() => {
      const fetchedProducts = [
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
      setProducts(fetchedProducts);
    },1000);
       
          
  }, []);

  return (
    <div className="flex flex-col lg:flex-row">
            {/*  Mobile filter buton */}
            <button
                onClick={toggleSidebar}
             className='lg:hidden border p-2 flex justify-center items-center'>
            <FaFilter className='mr-2' /> Filters
            </button>

            {/* Filter Sidebar */}
            <div 
            ref={sidebarRef} 
            className={`${isSidebarOpen ?"translate-x-0":"-translate-x-full"} fixed inset-y-0 z-50 left-0 w-64 bg-white overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0`}
            
            >
                <FilterSidebar />
            </div>
            <div className="flex-grow p-4">
                <h2 className='text-2xl uppercase mb-4'>All Collection</h2>

                {/* Sort options */}
                <SortOptions />

                {/* Products Grid */}
                <ProductGrid products={products} />

            </div>

    </div>
  )
}

export default CollectionPage
