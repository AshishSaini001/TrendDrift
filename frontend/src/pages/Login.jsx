import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom';
import login from '../assets/login.webp'
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isVisible, setIsVisible] = useState(false);


  const toggleVisible=()=>{
    setIsVisible(!isVisible);
  }
  const handleSubmit =(e)=>{
        e.preventDefault();
    }

  return (
    <div className='flex'>
      <div className='w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12'>
    <form onSubmit={handleSubmit} className='w-full max-w-md bg-white p-8 rounded-lg border shadow-sm'>
      <div className='flex justify-center mb-6 mr-10'>
          <img src="/trenddrift.svg" alt="logo" className="w-7 h-7 drop-shadow-[0_0_8px_rgba(255,0,0,0.5)]" />
            <h2 className="text-2xl font-bold">
              <span className="text-TrendDrift-red drop-shadow-[0_0_8px_rgba(255,0,0,0.5)]">
                Trend
              </span>
              <span className="text-neutral-900">Drift</span>
            </h2>
      </div>
      <h2 className='ttext-2xl font-bold text-center mb-6'>Hey there! 👋🏻 </h2>
      <p className='text-center mb-6'>
        Enter your username and password to Login.
      </p>
      <div className='mb-4'>
        <label htmlFor="" className='block text-sm font-semibold mb-2'>
          Email
        </label>
        <input type="email" className='w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500'
        value={email}
        placeholder='Enter your email address'
        onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className=' relative mb-4'>
        <label htmlFor="" className='block text-sm font-semibold mb-2'>
          Password
        </label>
        <input type={isVisible?"text":"password"} className='w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500'
        value={password}
        placeholder='Enter your password'
        onChange={(e) => setPassword(e.target.value)}
        />
        <span className='absolute right-3 top-10 cursor-pointer text-xl h-10 w-10'
          onClick={toggleVisible}
        >
          {isVisible ?(<AiFillEyeInvisible />) : (<AiFillEye />)}
        </span>
      </div>
      <button type='submit' className='w-full bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800 transition cursor-pointer'>Sign In</button>
      <p className='mt-6 text-center text-sm'>
        Don't have an account?{" "}
        <Link to="/register" className='text-blue-500 hover:underline ml-1'>Register</Link>
      </p>
    </form>
      </div>
    
    {/* Right side image */}

    <div  className='hidden md:block w-1/2 bg-gray-800'>
      <div className='h-full flex flex-col justify-center items-center'>
          <img src={login} alt="Login to Account" className='h-[650px] w-full object-cover'/>
      </div>
    </div>

    </div>
  )
}

export default Login
