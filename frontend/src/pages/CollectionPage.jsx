import React, { useEffect,useRef } from 'react'
import { FaFilter } from 'react-icons/fa';
import { useState } from 'react';
import FilterSidebar from '../components/Products/FilterSidebar';
import SortOptions from '../components/Products/SortOptions';
import ProductGrid from '../components/Products/ProductGrid';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByFilters } from '../redux/slices/productsSlice.js';

const PRODUCTS_PER_PAGE = 12;

const CollectionPage = () => {
    const {collection} =useParams();
    const [searchParams]=useSearchParams();
    const dispatch=useDispatch();
    const {products ,loading,error}=useSelector((state)=> state.products);
    const queryParams=Object.fromEntries([...searchParams]);
  const [currentPage, setCurrentPage] = useState(1);

  const sidebarRef =useRef(null);
  const [isSidebarOpen,setIsSidebarOpen]=useState(false);

useEffect(()=>{
    dispatch(fetchProductsByFilters({collection,...queryParams}));
},[dispatch,collection,searchParams]);

useEffect(() => {
  setCurrentPage(1);
}, [collection, searchParams.toString()]);

const totalPages = Math.max(1, Math.ceil(products.length / PRODUCTS_PER_PAGE));
const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
const paginatedProducts = products.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

const handlePageChange = (page) => {
  if (page < 1 || page > totalPages) {
    return;
  }
  setCurrentPage(page);
};

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
            className={`${isSidebarOpen ?"translate-x-0":"-translate-x-full"} fixed inset-y-0 z-50 left-0 w-58 bg-white overflow-y-auto transition-transform duration-300 lg:sticky lg:top-[100px] lg:h-[calc(100vh-100px)] lg:z-0 lg:translate-x-0`}
            
            >
                <FilterSidebar />
            </div>
            <div className="flex-1 p-4">
                <h2 className='text-2xl uppercase mt-8 ml-10 '><strong>All Collection</strong></h2>

                {/* Sort options */}
                <SortOptions />

                {/* Products Grid */}
                <ProductGrid products={paginatedProducts} loading={loading} error={error} />

                {!loading && !error && products.length > 0 && (
                  <div className="mt-8 flex flex-col items-center gap-4">
                    <p className="text-sm text-gray-600">
                      Showing {startIndex + 1}-{Math.min(startIndex + PRODUCTS_PER_PAGE, products.length)} of {products.length} products
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        Prev
                      </button>
                      {Array.from({ length: totalPages }, (_, index) => {
                        const page = index + 1;
                        return (
                          <button
                            key={page}
                            type="button"
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-1 rounded border ${currentPage === page ? "bg-black text-white border-black" : "border-gray-300"} cursor-pointer`}
                          >
                            {page}
                          </button>
                        );
                      })}
                      <button
                        type="button"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}

            </div>

    </div>
  )
}

export default CollectionPage
