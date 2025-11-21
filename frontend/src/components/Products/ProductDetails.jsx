
import { useState,useEffect } from 'react'
import { toast } from 'sonner';
import ProductGrid from './ProductGrid';





 const product = {
        name: "Classic White T-Shirt",
        price: 19.99,
        OriginalPrice: 29.99,
        description: "A timeless classic white t-shirt made from 100% organic cotton. Perfect for any occasion.",
        brand:"EcoWear",
        material:"100% Organic Cotton",
        sizes:["S","M","L","XL"],
        colors:["White","Black","Blue"],
        images:[
            {
                url:"https://picsum.photos/500/500/?random=11",
                altText:"Classic White T-Shirt Image 1"
            },
            {
                url:"https://picsum.photos/500/500/?random=12",
                altText:"Classic White T-Shirt Image 2"     
            },
        ]
    }


const similarProducts = [
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
]




const ProductDetails = () => {
    const [mainImage, setMainImage] = useState(null);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    
    useEffect(()=>{
        if(product.images && product.images.length >0){
            setMainImage(product.images[0].url);
        }
        
    },[product]);

    const handleQuantity=(type)=>{
        if(type==="+" ){
            setQuantity((prev)=> prev +1);
        } else{
            if(quantity >1){
                setQuantity((prev)=> prev -1);
            }
    }
}
const handleAddToCart=()=>{
    if(!selectedSize || !selectedColor){
        toast.error("Please select a size and color before adding to cart.",
            {duration:1000,}
        );
        return;
    }
    setIsButtonDisabled(true);

    setTimeout(()=>{
        toast.success("Product added to cart successfully!", {duration:1000,});
        setIsButtonDisabled(false);
    },500)
    
}


   
  return (
    <div className='p-6 md:ml-35'>
        <div className='max-w-6xl bg-white p-8 rounded-lg'>
            <div className='flex flex-col md:flex-row'>
                {/* Left Thumbmails */}
                <div className='hidden md:flex flex-col space-y-4 mr-6'>
                    {product.images.map((image,index)=>(
                        <img src={image.url}
                        key={index}
                        alt={image.altText || `THumbmail ${index}`} 
                        className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${mainImage===image.url ? 'border-black':'border-gray-300'}`}
                        onClick={()=>setMainImage(image.url)}
                        />
                    ))}
                </div>
                {/* Main Image */}
                <div className='md:w-1/2'>
                    <div className='mb-4'>
                        <img src={mainImage} alt="Main Product"
                        className='w-full h-auto object-cover rounded-lg'
                        />
                    </div>
                </div>
                {/* Mobile Thumbnails */}
                <div className='md:hidden flex overscroll-x-scroll space-x-4 mb-4 '>
                      {product.images.map((image,index)=>(
                        <img src={image.url}
                        key={index}
                        alt={image.altText || `THumbmail ${index}`} 
                        className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${mainImage===image.url ? 'border-black':'border-gray-300'}`}
                        onClick={()=>setMainImage(image.url)}
                        />
                    ))}
                </div>
                {/* RIght Side */}
                <div className='md:w-1/2 md:ml-10'>
                <h1 className='text-2xl md:text-3xl font-semibold mb-2'>
                    {product.name}
                </h1>
                <p className='text-lg text-gray-600 mb-1 line-through'>
                    {product.OriginalPrice && `${product.OriginalPrice}`}
                </p>
                <p className='text-xl text-gray-500 mb-2'>
                    ${product.price}
                </p>
                <p className='text-gray-700 mb-4'>
                    {product.description}
                </p>
                <div className='mb-4'>
                    <p className='text-gray-700'>
                    Color:
                </p>
                <div className='flex gap-2 mt-2'>
                    {product.colors.map((color)=>(
                        <button
                            key={color}
                            onClick={()=>setSelectedColor(color)}
                            className={`w-8 h-8 rounded-full border cursor-pointer ${selectedColor===color? 'border-4 border-black':'border-gray-300'}`}
                            style={{backgroundColor:color.toLocaleLowerCase(),
                                filter: "brightmess(0.8)"
                            }}
                        ></button>
                    ))}
                </div>
                </div>
                <div className='mb-4'>
                    <p className='text-gray-700'>Size:</p>
                    <div className='flex gap-2 mt-2'>
                        {product.sizes.map((size)=>(
                            <button
                            onClick={()=>setSelectedSize(size)}
                            key={size} className={`px-4 py-2 rounded border cursor-pointer ${selectedSize===size ? 'bg-black text-white':''}`}>
                                {size}
                            </button>
                        ))}
                    </div>
                </div>
                <div className='mb-6'>
                    <p className='text-gray-700'>Quantity:</p>
                    <div className='flex items-center space-x-4 mt-2'>
                        <button 
                        onClick={()=>handleQuantity('-')}
                        className=' cursor-pointer px-2 py-1 bg-gray-200 rounded text-lg'>-</button>
                        <span className='text-lg'>{quantity}</span>
                        <button 
                         onClick={()=>handleQuantity('+')}
                        className=' cursor-pointer px-2 py-1 bg-gray-200 rounded text-lg'>+</button>
                    </div>
                </div>
                <button
                disabled={isButtonDisabled}
                onClick={handleAddToCart}
                className={`bg-black cursor-pointer text-white py-2 px-6 rounded w-full mb-4
                ${isButtonDisabled ? 'opacity-50 cursor-not-allowed':'hover:bg-gray-900'}
                `}
                
                >
                    {isButtonDisabled ? 'Adding to Cart...':'ADD TO CART'}
                </button>
                <div className='mt-10 text-gray-700'>
                        <h3 className='text-xl font-bold mb-4'>Characteristics:
                        </h3>
                        <table className='w-full text-left text-sm text-gray-600'>
                            <tbody>
                                <tr>
                                    <td className='py-1'>Brand</td>
                                    <td className='py-1'>{product.brand}</td>
                                </tr>
                                <tr>
                                    <td className='py-1'>Material</td>
                                    <td className='py-1'>{product.material}</td>
                                </tr>

                            </tbody>
                        </table>
                </div>



                </div>
            </div>
            {/* you may also like section */}
                <div className='mt-20'>
                    <h2 className='text-2xl text-center font-medium mb-4'>
                        You may also like
                    </h2>
                    <ProductGrid products={similarProducts}/>
                </div>

            <div>

            </div>

        </div>
      
    </div>
  )
}

export default ProductDetails
