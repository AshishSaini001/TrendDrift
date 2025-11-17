import React ,{useState} from "react";
import { Link } from "react-router-dom";
import { HiOutlineUser ,HiOutlineShoppingBag , } from "react-icons/hi";
import {HiBars3BottomRight} from "react-icons/hi2";
import CartDrawer from "../Layout/CartDrawer";
import SearchBar from "./SearchBar";
const Navbar = () => {

const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleCartDrawer = () => {
    setDrawerOpen(!drawerOpen);
  }

  return (
    <>
      <nav className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Left - Logo */}
        <div>
          <Link to="/" className="text-wxl font-medium">
            <h1 className="text-3xl font-bold">
              <span className="text-TrendDrift-red drop-shadow-[0_0_8px_rgba(255,0,0,0.5)]">
                Trend
              </span>
              <span className="text-neutral-900">Drift</span>
            </h1>
          </Link>
        </div>
        {/* center - Navigation Links */}
        <div className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-700 hover:text-TrendDrift-red text-sm font-medium">MEN</Link>
            <Link to="/shop" className="text-gray-700  hover:text-TrendDrift-red text-sm font-medium">WOMEN</Link>
            <Link to="/about" className="text-gray-700  hover:text-TrendDrift-red text-sm font-medium">TOP WEAR</Link>
            <Link to="/about" className="text-gray-700  hover:text-TrendDrift-red text-sm font-medium">BOTTOM WEAR</Link>
        </div>
        {/* Right - Icons */}
        <div className="flex items-center space-x-4">
            <Link to="/profile" className="hover:text-TrendDrift-red">
            <HiOutlineUser className="h-6 w-6 text-gray-700" /> 
             </Link>

            <button className="relative hover:text-TrendDrift-red cursor-pointer"
            onClick={toggleCartDrawer}
            >
            <HiOutlineShoppingBag className="h-6 w-6 text-gray-700" />
            <span className="absolute -top-1 bg-TrendDrift-red text-white text-xs rounded-full px-2 py-0.5">
                3
            </span>
            </button>

            {/* Search */}
            <SearchBar />

            <button className="md:hidden">
                <HiBars3BottomRight className="h-6 w-6 text-gray-700  " />
            </button>
        </div>
      </nav>
      <CartDrawer  drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer}/>
    </>
  );
};

export default Navbar;
