import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import registerImg from '../assets/register.webp';
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, verifyOtp, googleAuth } from '../redux/slices/authSlice';
import { useGoogleLogin } from '@react-oauth/google';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isConfirmVisible, setIsConfirmVisible] = useState(false);
    const [submitError, setSubmitError] = useState('');
    
    // OTP State
    const [isOtpMode, setIsOtpMode] = useState(false);
    const [otp, setOtp] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { loading, user } = useSelector((state) => state.auth);

    const redirectPath = new URLSearchParams(location.search).get('redirect') || '/';
    // Ensure redirect is always an absolute path
    const redirect = redirectPath.startsWith('/') ? redirectPath : `/${redirectPath}`;

    // Redirect to home page when user is authenticated (after OTP verification)
    useEffect(() => {
        if (user && isOtpMode) {
            navigate(redirect, { replace: true });
        }
    }, [user, isOtpMode, navigate, redirect]);

    const toggleVisible = () => setIsVisible(!isVisible);
    const toggleConfirmVisible = () => setIsConfirmVisible(!isConfirmVisible);

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            const result = await dispatch(googleAuth({ token: tokenResponse.credential || tokenResponse.access_token }));
            if (!googleAuth.fulfilled.match(result)) {
                setSubmitError(result.payload?.message || "Google auth failed.");
            }
            // Navigation will happen via useEffect when user state is updated
        },
        onError: () => {
            setSubmitError('Google Auth failed.');
        }
    });

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');

        if (password !== confirmPassword) {
            setSubmitError("Passwords do not match");
            return;
        }
        if (!agreeTerms) {
            setSubmitError("You must agree to the Terms of Service");
            return;
        }

        const result = await dispatch(registerUser({ name, email, password }));

        if (registerUser.fulfilled.match(result)) {
            setIsOtpMode(true);
        } else {
            const message = result.payload?.message || result.error?.message || 'Registration failed';
            setSubmitError(message);
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');

        const result = await dispatch(verifyOtp({ email, otp }));
        if (!verifyOtp.fulfilled.match(result)) {
            setSubmitError(result.payload?.message || 'Verification failed');
        }
        // Navigation will happen via useEffect when user state is updated
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-[#E5F0F5] p-6'>
            <div className='flex w-full max-w-[1024px] bg-white rounded-xl shadow-xl overflow-hidden' style={{ minHeight: '680px' }}>
                {/* Left side image area */}
                <div className='hidden md:flex flex-col w-1/2 relative bg-[#1E252B] justify-center items-center'>
                    <img src={registerImg} alt="Curation" className='w-full h-[85%] object-cover absolute top-0' style={{ objectPosition: 'center top' }} />
                    <div className='absolute inset-0 bg-gradient-to-br from-black/10 to-black/60'></div>
                    
                    {/* Overlay quote card */}
                    <div className='absolute bottom-16 right-[-20px] bg-white/95 backdrop-blur-sm p-8 rounded shadow-2xl max-w-[280px] z-10'>
                        <p className='text-[#017a96] font-semibold italic text-xl mb-4 leading-snug'>
                            "True style is an artifact of personal curation."
                        </p>
                        <p className='text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase'>
                            The TrendDrift Editorial
                        </p>
                    </div>
                </div>

                {/* Right side form area */}
                <div className='w-full md:w-1/2 flex flex-col justify-center px-10 sm:px-14 py-12 z-0'>
                    {!isOtpMode ? (
                        <div className='max-w-[400px] w-full mx-auto'>
                            <h4 className='text-[11px] text-[#017a96] font-bold tracking-[0.15em] uppercase mb-1'>Join the Collective</h4>
                            <h1 className='text-3xl font-extrabold text-gray-900 mb-2 tracking-tight' style={{fontFamily: 'Inter, sans-serif'}}>Create Account</h1>
                            <p className='text-[13px] text-gray-600 mb-8 font-medium leading-relaxed'>
                                Become a part of TrendDrift and access curated collections and exclusive style editorials.
                            </p>

                            <button 
                                type="button"
                                onClick={() => handleGoogleLogin()} 
                                className='w-full flex items-center justify-center gap-3 border border-gray-200/80 bg-white hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5 cursor-pointer py-2.5 px-4 rounded transition-all duration-200 mb-6 shadow-sm font-semibold tracking-tight text-gray-800 text-sm'
                            >
                                <FcGoogle size={20} />
                                Sign up with Google
                            </button>

                            <div className="flex items-center my-6">
                                <div className="flex-grow border-t border-gray-100"></div>
                                <span className="flex-shrink-0 mx-4 text-gray-400 text-[10px] font-bold tracking-widest uppercase">Or via Email</span>
                                <div className="flex-grow border-t border-gray-100"></div>
                            </div>

                            <form onSubmit={handleRegisterSubmit}>
                                <div className='mb-4'>
                                    <label className='block text-[11px] font-bold text-gray-600 tracking-wider uppercase mb-2'>Full Name</label>
                                    <input type="text" 
                                        className='w-full border border-transparent bg-[#e7ebf0]/60 p-3 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#017a96] transition text-gray-800 font-medium placeholder-gray-400'
                                        value={name}
                                        placeholder='Alexander Sterling'
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className='mb-4'>
                                    <label className='block text-[11px] font-bold text-gray-600 tracking-wider uppercase mb-2'>Email Address</label>
                                    <input type="email" 
                                        className='w-full border border-transparent bg-[#e7ebf0]/60 p-3 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#017a96] transition text-gray-800 font-medium placeholder-gray-400'
                                        value={email}
                                        placeholder='alex@trenddrift.com'
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                
                                <div className='flex gap-4 mb-6'>
                                    <div className='w-1/2 relative'>
                                        <label className='block text-[11px] font-bold text-gray-600 tracking-wider uppercase mb-2'>Password</label>
                                        <input type={isVisible ? "text" : "password"} 
                                            className='w-full border border-transparent bg-[#e7ebf0]/60 p-3 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#017a96] transition text-gray-800 font-medium placeholder-gray-400'
                                            value={password}
                                            placeholder='••••••••'
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            minLength={6}
                                        />
                                        <span className='absolute right-3 top-[36px] cursor-pointer text-gray-400 hover:text-gray-600' onClick={toggleVisible}>
                                            {isVisible ? <AiFillEyeInvisible size={18}/> : <AiFillEye size={18}/>}
                                        </span>
                                    </div>
                                    <div className='w-1/2 relative'>
                                        <label className='block text-[11px] font-bold text-gray-600 tracking-wider uppercase mb-2'>Confirm</label>
                                        <input type={isConfirmVisible ? "text" : "password"} 
                                            className='w-full border border-transparent bg-[#e7ebf0]/60 p-3 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#017a96] transition text-gray-800 font-medium placeholder-gray-400'
                                            value={confirmPassword}
                                            placeholder='••••••••'
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            minLength={6}
                                        />
                                        <span className='absolute right-3 top-[36px] cursor-pointer text-gray-400 hover:text-gray-600' onClick={toggleConfirmVisible}>
                                            {isConfirmVisible ? <AiFillEyeInvisible size={18}/> : <AiFillEye size={18}/>}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center mb-8">
                                    <input type="checkbox" id="terms" 
                                        className="w-[14px] h-[14px] rounded border-gray-300 text-[#017a96] focus:ring-[#017a96]"
                                        checked={agreeTerms}
                                        onChange={(e) => setAgreeTerms(e.target.checked)}
                                    />
                                    <label htmlFor="terms" className="ml-3 text-[12px] text-gray-700 font-medium">
                                        I agree to the <span className='text-[#017a96] font-bold cursor-pointer hover:underline border-b border-[#017a96]/30'>Terms of Service</span> and <span className='text-[#017a96] font-bold cursor-pointer hover:underline border-b border-[#017a96]/30'>Privacy Policy</span>.
                                    </label>
                                </div>

                                <button type='submit' disabled={loading} className='w-full bg-[#017a96] text-white p-3 rounded font-semibold hover:bg-[#016880] hover:shadow-lg hover:-translate-y-0.5 cursor-pointer transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed text-sm tracking-wide'>
                                    {loading ? 'Processing...' : 'Send Verification Code'}
                                </button>
                                
                                {submitError && (
                                    <div className='mt-4 p-2'>
                                        <p className='text-xs text-red-600 text-center font-semibold'>
                                            {submitError}
                                        </p>
                                    </div>
                                )}

                                <div className='mt-8 pt-6 border-t border-gray-100 text-center'>
                                    <p className='text-[13px] text-gray-600 font-medium mb-1'>Already a member of the drift?</p>
                                    <Link to="/login" className='text-[#017a96] font-bold text-[13px] hover:underline tracking-wide'>Login to your account &rarr;</Link>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className='max-w-[400px] w-full mx-auto'>
                            <h4 className='text-[11px] text-[#017a96] font-bold tracking-[0.15em] uppercase mb-1'>Verification</h4>
                            <h1 className='text-3xl font-extrabold text-gray-900 mb-2 tracking-tight' style={{fontFamily: 'Inter, sans-serif'}}>Check your email</h1>
                            <p className='text-[13px] text-gray-600 mb-8 font-medium leading-relaxed'>
                                We've sent a 6-digit verification code to <br/> <span className='font-bold text-gray-800'>{email}</span>.
                            </p>

                            <form onSubmit={handleOtpSubmit}>
                                <div className='mb-8'>
                                    <label className='block text-[11px] font-bold text-gray-600 tracking-wider uppercase mb-3'>Verification Code</label>
                                    <input type="text" 
                                        className='w-full border border-transparent bg-[#e7ebf0]/60 p-4 rounded focus:outline-none focus:ring-2 focus:ring-[#017a96] transition text-center text-3xl tracking-[0.4em] font-mono font-bold text-gray-800'
                                        value={otp}
                                        placeholder='000000'
                                        maxLength={6}
                                        onChange={(e) => setOtp(e.target.value)}
                                        required
                                    />
                                </div>

                                <button type='submit' disabled={loading} className='w-full bg-[#017a96] text-white p-3 rounded font-semibold hover:bg-[#016880] hover:shadow-lg hover:-translate-y-0.5 cursor-pointer transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed text-sm tracking-wide'>
                                    {loading ? 'Verifying...' : 'Verify Code'}
                                </button>
                                
                                {submitError && (
                                    <div className='mt-4 p-2'>
                                        <p className='text-xs text-red-600 text-center font-semibold'>
                                            {submitError}
                                        </p>
                                    </div>
                                )}

                                <div className='mt-8 pt-6 border-t border-gray-100 text-center'>
                                    <p className='text-[13px] text-gray-600 font-medium mb-1'>Didn't receive the code?</p>
                                    <button type='button' disabled={loading} className='text-[#017a96] font-bold text-[13px] hover:underline tracking-wide bg-transparent border-none cursor-pointer'>
                                          Resend Code
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Register;
