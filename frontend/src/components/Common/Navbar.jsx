import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineUser ,HiOutlineShoppingBag , } from "react-icons/hi";
import {IoMdClose} from "react-icons/io";
import {HiBars3BottomRight} from "react-icons/hi2";
import CartDrawer from "../Layout/CartDrawer";
import SearchBar from "./SearchBar";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "../../redux/slices/cartSlice";
const Navbar = () => {

const [drawerOpen, setDrawerOpen] = useState(false);
const [navOpen, setNavOpen] = useState(false);
const dispatch = useDispatch();
const {cart}=useSelector((state) => state.cart);
const { user, guestId } = useSelector((state) => state.auth);
const isAdmin = user?.role === "admin";

useEffect(() => {
  dispatch(
    fetchCart({
      userId: user?._id,
      guestId,
    }),
  );
}, [dispatch, user?._id, guestId]);

const cartItemCount = cart?.products?.reduce((total, product) => total + product.quantity, 0) || 0;

const toggleNavDrawer=()=>{
    setNavOpen(!navOpen);
}

  const toggleCartDrawer = () => {
    setDrawerOpen(!drawerOpen);
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 mt-10 w-full bg-white shadow-md">
        <div className="mx-auto flex w-full max-w-none items-center justify-between py-1 px-6">
          {/* Left - Logo */}
          <div>
            <Link to="/" className=" flex text-wxl font-medium">
              <img src="/trenddrift.svg" alt="logo" className="w-10 h-10 drop-shadow-[0_0_8px_rgba(1,157,192,0.6)]" />
              <h1 className="text-3xl font-bold">
                <span className="text-TrendDrift-red drop-shadow-[0_0_8px_rgba(1,157,192,0.6)]">
                  Trend
                </span>
                <span className="text-neutral-900">Drift</span>
              </h1>
            </Link>
          </div>
          {/* center - Navigation Links */}
          <div className="hidden md:flex space-x-6">
              <Link to="/collections/all?gender=Men" className="text-gray-700 hover:text-TrendDrift-red text-sm font-medium">MEN</Link>
              <Link to="/collections/all?gender=Women" className="text-gray-700  hover:text-TrendDrift-red text-sm font-medium">WOMEN</Link>
              <Link to="/collections/all?category=Top Wear" className="text-gray-700  hover:text-TrendDrift-red text-sm font-medium">TOP WEAR</Link>
              <Link to="/collections/all?category=Bottom Wear" className="text-gray-700  hover:text-TrendDrift-red text-sm font-medium">BOTTOM WEAR</Link>
          </div>
          {/* Right - Icons */}
          <div className="flex items-center space-x-4">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="rounded-full border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 hover:border-TrendDrift-red hover:text-TrendDrift-red"
                >
                  Admin
                </Link>
              )}

              <Link to="/profile" className="hover:text-TrendDrift-red">
              <HiOutlineUser className="h-6 w-6 text-gray-700" /> 
               </Link>

              <button className="relative hover:text-TrendDrift-red cursor-pointer"
              onClick={toggleCartDrawer}
              >
              <HiOutlineShoppingBag className="h-6 w-6 text-gray-700" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
              </button>

              {/* Search */}
              <SearchBar />

              <button className="md:hidden"
              onClick={toggleNavDrawer}
              >
                  <HiBars3BottomRight className="h-6 w-6 text-gray-700  " />
              </button>
          </div>
        </div>
      </nav>
      <CartDrawer  drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer}/>

      {/* Mobile Navigation */}
      <div className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg transfrom transition-transform duration-300 z-50 ${navOpen ? "translate-x-0" : "-translate-x-full"} `}>
      <div className="flex justify-end p-4">
          <button>
            <IoMdClose className="h-6 w-6 text-gray-600 cursor-pointer" onClick={toggleNavDrawer} />
          </button>
        </div>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Menu</h2>
          <nav className="space-y-4">
            {isAdmin && (
              <Link to="/admin" onClick={toggleNavDrawer} className="block text-gray-600 hover:text-black">
                Admin
              </Link>
            )}
            <Link to="/collections/all?gender=Men" onClick={toggleNavDrawer} className="block text-gray-600 hover:text-black">
            Men
            </Link>
            <Link to="/collections/all?gender=Women" onClick={toggleNavDrawer} className="block text-gray-600 hover:text-black">
            Women
            </Link>
            <Link to="/collections/all?category=Top Wear" onClick={toggleNavDrawer} className="block text-gray-600 hover:text-black">
            Top Wear
            </Link>
            <Link to="/collections/all?category=Bottom Wear" onClick={toggleNavDrawer} className="block text-gray-600 hover:text-black">
            Bottom Wear
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;
