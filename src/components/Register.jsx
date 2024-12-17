import {
    Envelope,
    Eye,
    EyeSlash,
    IdentificationCard,
    Lock,
    Phone,
    ShieldCheck,
    Storefront,
    User,
    UserCirclePlus,
    MapPin,
    Bank,
    ArrowRight,
} from "@phosphor-icons/react";
import {useState} from "react";
import toast from "react-hot-toast";
import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router-dom";
import {register} from "../store/features/authSlice";
import {toggleTheme} from "../store/features/themeSlice";
import Header from "./Header";
import axios from "axios";

function Register() {
    // State management
    const [selectedType, setSelectedType] = useState("");
    const [currentStep, setCurrentStep] = useState('registration');
    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        // Seller specific fields
        storeName: "",
        location: "",
        bankDetails: {
            accountHolder: "",
            accountNumber: "",
            bankName: "",
            ifscCode: "",
        },
    });

    const [verificationData, setVerificationData] = useState({
        emailOtp: '',
        phoneOtp: '',
        emailVerified: false,
        phoneVerified: false
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const dispatch = useDispatch();
    const {isLoading} = useSelector((state) => state.auth);
    const {darkMode} = useSelector((state) => state.theme);

    const userTypes = [
        {id: "customer", label: "Customer", icon: User},
        {id: "seller", label: "Seller", icon: Storefront},
    ];

    // Google Sign In handler
    const handleGoogleSignIn = () => {
        // Implement Google Sign In logic here
        console.log("Google Sign In clicked");
    };

    // OTP verification handlers
    const verifyEmailOtp = async () => {
        try {
            // Replace with actual API call
            const response = await axios.get(`https://ecom-be-t42v.onrender.com/api/v1/auth/verify-email/${verificationData.emailOtp}`);
            if(response) {
                setVerificationData(prev => ({...prev, emailVerified: true}));
                toast.success('Email verified successfully!');
            }
        } catch (error) {
            toast.error('Email verification failed');
        }
    };

    const verifyPhoneOtp = async () => {
        try {
            // Replace with actual API call
            const response = await axios.post(`https://ecom-be-t42v.onrender.com/api/v1/auth/verify-phone`, { code: verificationData.phoneOtp, phone: formData.phone});
            setVerificationData(prev => ({...prev, phoneVerified: true}));
            toast.success('Phone verified successfully!');
        } catch (error) {
            toast.error('Phone verification failed');
        }
    };

    // Form submission handlers
    const handleRegistrationSuccess = () => {
        setCurrentStep('verification');
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!selectedType) {
            toast.error("Please select a user type");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            await dispatch(register({userData: formData, role: selectedType})).unwrap();
            toast.success("Registration successful! Please verify your contact details.");
            handleRegistrationSuccess();
        } catch (error) {
            toast.error(error || "Registration failed");
        }
    };

    // Navigation handlers
    const handleVerificationNext = () => {
        if (!verificationData.emailVerified || !verificationData.phoneVerified) {
            toast.error('Please verify both email and phone');
            return;
        }

        if (selectedType === 'seller') {
            setCurrentStep('business');
        } else {
            window.location.href = 'http://localhost:3000/';
        }
    };

    const handleBusinessComplete = (skipBusiness = false) => {
        if (skipBusiness) {
            window.location.href = 'https://ecom-be-t42v.onrender.com/';
            return;
        }

        // Validate business details if not skipping
        if (!formData.storeName || !formData.location ||
            !formData.bankDetails.accountHolder || !formData.bankDetails.accountNumber ||
            !formData.bankDetails.bankName || !formData.bankDetails.ifscCode) {
            toast.error('Please fill in all required fields');
            return;
        }

        window.location.href = 'https://ecom-be-t42v.onrender.com/';
    };

    // Render different form sections
    const renderRegistrationForm = () => (
        <>
            <div className="text-center">
                <h2 className="text-3xl font-bold text-[var(--text-color)]">
                    Create Account
                </h2>
                <p className="mt-2 text-[var(--text-color)]">
                    Join Technology Heaven today
                </p>
            </div>

            {/* Google Sign In Button */}
            <button
                onClick={handleGoogleSignIn}
                className="w-full py-3 px-4 rounded-lg border border-gray-300 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                </svg>
                <span>Continue with Google</span>
            </button>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-[var(--bg-color)] text-[var(--text-color)]">
            Or continue with email
          </span>
                </div>
            </div>

            {/* User Type Selection */}
            <div className="grid grid-cols-2 gap-4">
                {userTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                        <button
                            key={type.id}
                            onClick={() => setSelectedType(type.id)}
                            className={`py-3 px-4 rounded-lg transition-all duration-200 flex flex-col items-center space-y-2 ${
                                selectedType === type.id
                                    ? "bg-[var(--button-bg-color)] text-[var(--button-text-color)]"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                            }`}
                        >
                            <Icon
                                weight={selectedType === type.id ? "fill" : "regular"}
                                size={24}
                            />
                            <span>{type.label}</span>
                        </button>
                    );
                })}
            </div>

            <form onSubmit={onSubmit} className="mt-8 space-y-6">
                <div className="space-y-4">
                    {/* Basic Registration Fields */}
                    <div>
                        <label htmlFor="fullname" className="block text-sm font-medium text-[var(--text-color)]">
                            Full Name
                        </label>
                        <div className="mt-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <IdentificationCard className="h-5 w-5 text-gray-400" weight="duotone"/>
                            </div>
                            <input
                                id="fullname"
                                name="fullname"
                                type="text"
                                required
                                className="pl-10 block w-full px-4 py-3 bg-[var(--input-bg-color)] border border-[var(--input-border-color)] rounded-lg text-[var(--text-color)] focus:ring-gray-500 focus:border-gray-500 transition-colors duration-200"
                                placeholder="Enter your full name"
                                value={formData.fullname}
                                onChange={(e) => setFormData({...formData, fullname: e.target.value})}
                            />
                        </div>
                    </div>

                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-[var(--text-color)]">
                            Email
                        </label>
                        <div className="mt-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Envelope className="h-5 w-5 text-gray-400" weight="duotone"/>
                            </div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="pl-10 block w-full px-4 py-3 bg-[var(--input-bg-color)] border border-[var(--input-border-color)] rounded-lg text-[var(--text-color)] focus:ring-gray-500 focus:border-gray-500 transition-colors duration-200"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                    </div>

                    {/* Phone Field */}
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-[var(--text-color)]">
                            Phone Number
                        </label>
                        <div className="mt-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Phone className="h-5 w-5 text-gray-400" weight="duotone"/>
                            </div>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                required
                                className="pl-10 block w-full px-4 py-3 bg-[var(--input-bg-color)] border border-[var(--input-border-color)] rounded-lg text-[var(--text-color)] focus:ring-gray-500 focus:border-gray-500 transition-colors duration-200"
                                placeholder="Enter your phone number"
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            />
                        </div>
                    </div>

                    {/* Password Fields */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-[var(--text-color)]">
                            Password
                        </label>
                        <div className="mt-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" weight="duotone"/>
                            </div>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                className="pl-10 block w-full px-4 py-3 bg-[var(--input-bg-color)] border border-[var(--input-border-color)] rounded-lg text-[var(--text-color)] focus:ring-gray-500 focus:border-gray-500 transition-colors duration-200"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeSlash size={20}/> : <Eye size={20}/>}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--text-color)]">
                            Confirm Password
                        </label>
                        <div className="mt-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" weight="duotone"/>
                            </div>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                className="pl-10 block w-full px-4 py-3 bg-[var(--input-bg-color)] border border-[var(--input-border-color)] rounded-lg text-[var(--text-color)] focus:ring-gray-500 focus:border-gray-500 transition-colors duration-200"
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                            >
                                {showConfirmPassword ? <EyeSlash size={20}/> : <Eye size={20}/>}
                            </button>
                        </div>
                    </div>
                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading || !selectedType}
                        className={`w-full py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 ${
                            isLoading || !selectedType
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-[var(--button-bg-color)] hover:bg-[var(--button-hover-bg-color)]"
                        } text-[var(--button-text-color)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500`}
                    >
                        <UserCirclePlus weight="bold" size={20}/>
                        <span>{isLoading ? "Creating account..." : "Create account"}</span>
                    </button>

                    <div className="text-center">
                        <p className="text-sm text-[var(--text-color)]">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="font-medium text-[var(--link-color)] hover:underline"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </form>
        </>
    );

    const renderVerificationStep = () => (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-[var(--text-color)]">
                    Verify Your Contact Details
                </h2>
                <p className="mt-2 text-[var(--text-color)]">
                    Please verify your email and phone number
                </p>
            </div>

            <div className="space-y-4">
                {/* Email Verification */}
                <div className="flex items-center space-x-4">
                    <div className="flex-grow">
                        <label className="block text-sm font-medium text-[var(--text-color)]">
                            Email OTP
                        </label>
                        <div className="mt-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Envelope className="h-5 w-5 text-gray-400" weight="duotone"/>
                            </div>
                            <input
                                type="text"
                                className="pl-10 block w-full px-4 py-3 bg-[var(--input-bg-color)] border border-[var(--input-border-color)] rounded-lg text-[var(--text-color)]"
                                placeholder="Enter email OTP"
                                value={verificationData.emailOtp}
                                onChange={(e) => setVerificationData(prev => ({...prev, emailOtp: e.target.value}))}
                                disabled={verificationData.emailVerified}
                            />
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={verifyEmailOtp}
                        disabled={verificationData.emailVerified}
                        className={`mt-7 px-4 py-3 rounded-lg ${
                            verificationData.emailVerified
                                ? 'bg-green-500 text-white cursor-not-allowed'
                                : 'bg-[var(--button-bg-color)] text-[var(--button-text-color)]'
                        }`}
                    >
                        {verificationData.emailVerified ? 'Verified ✓' : 'Verify'}
                    </button>
                </div>

                {/* Phone Verification */}
                <div className="flex items-center space-x-4">
                    <div className="flex-grow">
                        <label className="block text-sm font-medium text-[var(--text-color)]">
                            Phone OTP
                        </label>
                        <div className="mt-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Phone className="h-5 w-5 text-gray-400" weight="duotone"/>
                            </div>
                            <input
                                type="text"
                                className="pl-10 block w-full px-4 py-3 bg-[var(--input-bg-color)] border border-[var(--input-border-color)] rounded-lg text-[var(--text-color)]"
                                placeholder="Enter phone OTP"
                                value={verificationData.phoneOtp}
                                onChange={(e) => setVerificationData(prev => ({...prev, phoneOtp: e.target.value}))}
                                disabled={verificationData.phoneVerified}
                            />
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={verifyPhoneOtp}
                        disabled={verificationData.phoneVerified}
                        className={`mt-7 px-4 py-3 rounded-lg ${
                            verificationData.phoneVerified
                                ? 'bg-green-500 text-white cursor-not-allowed'
                                : 'bg-[var(--button-bg-color)] text-[var(--button-text-color)]'
                        }`}
                    >
                        {verificationData.phoneVerified ? 'Verified ✓' : 'Verify'}
                    </button>
                </div>
            </div>

            <button
                type="button"
                onClick={handleVerificationNext}
                disabled={!verificationData.emailVerified || !verificationData.phoneVerified}
                className={`w-full py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 ${
                    !verificationData.emailVerified || !verificationData.phoneVerified
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-[var(--button-bg-color)] hover:bg-[var(--button-hover-bg-color)]"
                } text-[var(--button-text-color)]`}
            >
                <span>Next</span>
                <ArrowRight weight="bold" size={20}/>
            </button>
        </div>
    );

    const renderBusinessProfileStep = () => (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-[var(--text-color)]">
                    Complete Business Profile
                </h2>
                <p className="mt-2 text-[var(--text-color)]">
                    Set up your store details
                </p>
            </div>

            <div className="space-y-4">
                {/* Store Name */}
                <div>
                    <label htmlFor="storeName" className="block text-sm font-medium text-[var(--text-color)]">
                        Store Name
                    </label>
                    <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Storefront className="h-5 w-5 text-gray-400" weight="duotone"/>
                        </div>
                        <input
                            id="storeName"
                            type="text"
                            className="pl-10 block w-full px-4 py-3 bg-[var(--input-bg-color)] border border-[var(--input-border-color)] rounded-lg text-[var(--text-color)]"
                            placeholder="Enter store name"
                            value={formData.storeName}
                            onChange={(e) => setFormData({...formData, storeName: e.target.value})}
                        />
                    </div>
                </div>

                {/* Location */}
                <div>
                    <label htmlFor="location" className="block text-sm font-medium text-[var(--text-color)]">
                        Store Location
                    </label>
                    <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPin className="h-5 w-5 text-gray-400" weight="duotone"/>
                        </div>
                        <input
                            id="location"
                            type="text"
                            className="pl-10 block w-full px-4 py-3 bg-[var(--input-bg-color)] border border-[var(--input-border-color)] rounded-lg text-[var(--text-color)]"
                            placeholder="Enter store location"
                            value={formData.location}
                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                        />
                    </div>
                </div>

                {/* Bank Details Section */}
                <div className="space-y-4 pt-4">
                    <h3 className="text-lg font-medium text-[var(--text-color)]">Bank Details</h3>

                    {/* Account Holder */}
                    <div>
                        <label htmlFor="accountHolder" className="block text-sm font-medium text-[var(--text-color)]">
                            Account Holder Name
                        </label>
                        <div className="mt-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400" weight="duotone"/>
                            </div>
                            <input
                                id="accountHolder"
                                type="text"
                                className="pl-10 block w-full px-4 py-3 bg-[var(--input-bg-color)] border border-[var(--input-border-color)] rounded-lg text-[var(--text-color)]"
                                placeholder="Enter account holder name"
                                value={formData.bankDetails.accountHolder}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    bankDetails: {...formData.bankDetails, accountHolder: e.target.value}
                                })}
                            />
                        </div>
                    </div>

                    {/* Account Number */}
                    <div>
                        <label htmlFor="accountNumber" className="block text-sm font-medium text-[var(--text-color)]">
                            Account Number
                        </label>
                        <div className="mt-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Bank className="h-5 w-5 text-gray-400" weight="duotone"/>
                            </div>
                            <input
                                id="accountNumber"
                                type="text"
                                className="pl-10 block w-full px-4 py-3 bg-[var(--input-bg-color)] border border-[var(--input-border-color)] rounded-lg text-[var(--text-color)]"
                                placeholder="Enter account number"
                                value={formData.bankDetails.accountNumber}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    bankDetails: {...formData.bankDetails, accountNumber: e.target.value}
                                })}
                            />
                        </div>
                    </div>

                    {/* Bank Name */}
                    <div>
                        <label htmlFor="bankName" className="block text-sm font-medium text-[var(--text-color)]">
                            Bank Name
                        </label>
                        <div className="mt-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Bank className="h-5 w-5 text-gray-400" weight="duotone"/>
                            </div>
                            <input
                                id="bankName"
                                type="text"
                                className="pl-10 block w-full px-4 py-3 bg-[var(--input-bg-color)] border border-[var(--input-border-color)] rounded-lg text-[var(--text-color)]"
                                placeholder="Enter bank name"
                                value={formData.bankDetails.bankName}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    bankDetails: {...formData.bankDetails, bankName: e.target.value}
                                })}
                            />
                        </div>
                    </div>

                    {/* IFSC Code */}
                    <div>
                        <label htmlFor="ifscCode" className="block text-sm font-medium text-[var(--text-color)]">
                            IFSC Code
                        </label>
                        <div className="mt-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Bank className="h-5 w-5 text-gray-400" weight="duotone"/>
                            </div>
                            <input
                                id="ifscCode"
                                type="text"
                                className="pl-10 block w-full px-4 py-3 bg-[var(--input-bg-color)] border border-[var(--input-border-color)] rounded-lg text-[var(--text-color)]"
                                placeholder="Enter IFSC code"
                                value={formData.bankDetails.ifscCode}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    bankDetails: {...formData.bankDetails, ifscCode: e.target.value}
                                })}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex space-x-4 pt-4">
                <button
                    type="button"
                    onClick={() => handleBusinessComplete(true)}
                    className="w-1/2 py-3 px-4 rounded-lg border border-[var(--button-bg-color)] text-[var(--button-bg-color)]"
                >
                    Skip for now
                </button>
                <button
                    type="button"
                    onClick={() => handleBusinessComplete(false)}
                    className="w-1/2 py-3 px-4 rounded-lg bg-[var(--button-bg-color)] text-[var(--button-text-color)]"
                >
                    Complete Profile
                </button>
            </div>
        </div>
    );

    // Main render
    return (
        <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
            <div className="min-h-screen bg-[var(--bg-color)]">
                <Header darkMode={darkMode} toggleTheme={() => dispatch(toggleTheme())}/>

                <div className="flex-grow flex items-center justify-center px-4 py-12">
                    <div className="max-w-md w-full space-y-8">
                        {currentStep === 'registration' && renderRegistrationForm()}
                        {currentStep === 'verification' && renderVerificationStep()}
                        {currentStep === 'business' && renderBusinessProfileStep()}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;