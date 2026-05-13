import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import loginImg from '../assets/login.webp';
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, googleAuth } from '../redux/slices/authSlice';
import { useGoogleLogin } from '@react-oauth/google';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [submitError, setSubmitError] = useState('');
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, user } = useSelector((state) => state.auth);

    // Redirect if already logged in as admin
    useEffect(() => {
        if (user && user.role === 'admin') {
            navigate('/admin', { replace: true });
        }
    }, [user, navigate]);

    const toggleVisible = () => setIsVisible(!isVisible);

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            const result = await dispatch(googleAuth({ token: tokenResponse.credential || tokenResponse.access_token }));
            if (!googleAuth.fulfilled.match(result)) {
                setSubmitError(result.payload?.message || "Google auth failed.");
            } else if (result.payload?.role !== 'admin') {
                setSubmitError("Only admin accounts can access this page.");
                // Optionally logout the user if they're not an admin
            }
            // Navigation will happen via useEffect when user state is updated
        },
        onError: () => {
            setSubmitError('Google Auth failed.');
        }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');

        const result = await dispatch(loginUser({ email, password }));
        if (!loginUser.fulfilled.match(result)) {
            const message = result.payload?.message || result.error?.message || 'Login failed';
            
            if (result.payload?.unverified) {
                setSubmitError("Email not verified. Please check your email for OTP.");
            } else {
                setSubmitError(message);
            }
        } else {
            // Check if user is admin
            if (result.payload?.role !== 'admin') {
                setSubmitError("Only admin accounts can access this page.");
            }
        }
        // Navigation will happen via useEffect when user state is updated
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-[#E5F0F5] p-6'>
            <div className='flex w-full max-w-[1024px] bg-white rounded-xl shadow-xl overflow-hidden' style={{ minHeight: '620px' }}>
                {/* Left side image area */}
                <div className='hidden md:block w-1/2 relative bg-gray-900'>
                    <img src={loginImg} alt="Admin Login" className='w-full h-full object-cover absolute inset-0' />
                    
                    {/* Gradient Overlay for text readability */}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent'></div>

                    {/* Bottom Text Area */}
                    <div className='absolute bottom-12 left-10 right-10 text-white'>
                        <h2 className='text-3xl font-bold mb-3 tracking-tight' style={{fontFamily: 'Inter, sans-serif'}}>
                            Admin Access <br /> Control Panel.
                        </h2>
                        <p className='text-gray-300 text-sm font-medium pr-8'>
                            Secure access to the TrendDrift administration dashboard. Authorized personnel only.
                        </p>
                    </div>
                </div>

                {/* Right side form area */}
                <div className='w-full md:w-1/2 flex flex-col justify-center px-10 sm:px-14 py-12'>
                    <div className='max-w-[400px] w-full mx-auto'>
                        <h4 className='text-[11px] text-[#017a96] font-bold tracking-[0.15em] uppercase mb-1'>Admin Portal</h4>
                        <h1 className='text-3xl font-extrabold text-gray-900 mb-2 tracking-tight' style={{fontFamily: 'Inter, sans-serif'}}>Admin Sign In</h1>
                        <p className='text-[13px] text-gray-600 mb-8 font-medium'>
                            Enter your credentials to access the admin dashboard.
                        </p>

                        <button 
                            type="button"
                            onClick={() => handleGoogleLogin()} 
                            className='w-full flex items-center justify-center gap-3 border border-gray-200/80 bg-gray-50/50 hover:bg-gray-100 hover:shadow-md hover:-translate-y-0.5 cursor-pointer py-2.5 px-4 rounded text-sm transition-all duration-200 tracking-tight font-semibold text-gray-800 mb-6'
                        >
                            <FcGoogle size={20} />
                            Continue with Google
                        </button>

                        <div className="flex items-center my-6">
                            <div className="flex-grow border-t border-gray-100"></div>
                            <span className="flex-shrink-0 mx-4 text-gray-500 text-[10px] font-bold tracking-widest uppercase">Or Continue with Email</span>
                            <div className="flex-grow border-t border-gray-100"></div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className='mb-5'>
                                <label className='block text-[11px] font-bold text-gray-700 tracking-wider uppercase mb-2'>Email Address</label>
                                <input type="email" 
                                    className='w-full border border-transparent bg-[#e7ebf0]/60 p-3 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#017a96] focus:border-transparent transition text-gray-800 font-medium placeholder-gray-400'
                                    value={email}
                                    placeholder='admin@trenddrift.com'
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            
                            <div className='relative mb-5'>
                                <div className='flex justify-between items-center mb-2'>
                                    <label className='block text-[11px] font-bold text-gray-700 tracking-wider uppercase'>Password</label>
                                    <a href="#" className='text-[10px] font-bold text-[#017a96] hover:underline uppercase tracking-wider'>Forgot Password?</a>
                                </div>
                                <input type={isVisible ? "text" : "password"} 
                                    className='w-full border border-transparent bg-[#e7ebf0]/60 p-3 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#017a96] focus:border-transparent transition text-gray-800 font-medium placeholder-gray-400'
                                    value={password}
                                    placeholder='••••••••'
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <span className='absolute right-4 top-[36px] cursor-pointer text-gray-400 hover:text-gray-600 transition' onClick={toggleVisible}>
                                    {isVisible ? <AiFillEyeInvisible size={18}/> : <AiFillEye size={18}/>}
                                </span>
                            </div>

                            <button type='submit' disabled={loading} className='w-full bg-[#017a96] text-white p-3 rounded font-semibold hover:bg-[#016880] hover:shadow-lg hover:-translate-y-0.5 cursor-pointer transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed text-sm tracking-wide'>
                                {loading ? 'Signing In...' : 'Admin Sign In'}
                            </button>
                            
                            {(submitError || error) && (
                                <div className='mt-4 p-3 bg-red-50 rounded'>
                                    <p className='text-xs text-red-600 text-center font-semibold'>
                                        {submitError || error}
                                    </p>
                                </div>
                            )}

                            <div className='mt-8 text-center'>
                                <p className='text-[13px] text-gray-600 font-medium'>
                                    Not an admin?{" "}
                                    <Link to="/" className='text-[#017a96] font-bold hover:underline tracking-wide ml-1'>Back to Home</Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
