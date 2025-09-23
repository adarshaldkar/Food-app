import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { config } from "@/config/env";

const BecomeOwner = () => {
  const { user } = useUserStore();
  const navigate = useNavigate();
  
  const [input, setInput] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [ownerRequestStatus, setOwnerRequestStatus] = useState(user?.ownerRequestStatus || 'none');
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  console.log('Current OTP state:', otp);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyEmailLoading, setVerifyEmailLoading] = useState(false);

  // Pre-fill form with user data if available and check existing status
  useEffect(() => {
    if (user) {
      setInput({
        name: user.fullName || "",
        email: user.email || "",
        phone: user.contact || "",
      });
      setOwnerRequestStatus(user.ownerRequestStatus || 'none');
      
      // Check if user has verified email for owner request
      const storedVerifiedEmail = localStorage.getItem('ownerRequestVerifiedEmail');
      if (storedVerifiedEmail === user.email) {
        setEmailVerified(true);
        setVerifiedEmail(storedVerifiedEmail);
      }
      
      // If user already has a verified request, show appropriate message
      if (user.ownerRequestStatus === 'verified') {
        navigate('/owner-verification-status');
      } else if (user.ownerRequestStatus === 'approved') {
        navigate('/admin/restaurant');
      }
    }
  }, [user, navigate]);

  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!input.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!input.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(input.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!input.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(input.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }
    
    if (!emailVerified) {
      newErrors.email = newErrors.email || "Please verify your email first";
    }
    
    return newErrors;
  };

  const sendEmailVerification = async () => {
    if (!input.email.trim()) {
      toast.error("Please enter an email address first");
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(input.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setVerifyEmailLoading(true);
    try {
      const response = await axios.post(
        `${config.API_BASE_URL}/users/send-email-verification-otp`,
        { email: input.email },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        }
      );
      
      if (response.data.success) {
        toast.success(response.data.message);
        console.log('Showing OTP dialog');
        setShowOTPDialog(true);
        // Focus first input after a short delay
        setTimeout(() => {
          const firstInput = document.getElementById('otp-0');
          if (firstInput) {
            firstInput.focus();
            console.log('Focused first OTP input');
          }
        }, 100);
      }
    } catch (error: any) {
      console.error("Error sending verification email:", error);
      toast.error(error.response?.data?.message || "Failed to send verification email");
    } finally {
      setVerifyEmailLoading(false);
    }
  };
  
  const handleOTPChange = (index: number, value: string) => {
    // Allow alphanumeric characters (letters and numbers)
    if (value === '' || /^[a-zA-Z0-9]$/.test(value)) {
      const newOtp = [...otp];
      // Convert to uppercase for consistency
      newOtp[index] = value ;
      setOtp(newOtp);
      
      console.log(`OTP changed at index ${index}: ${value}`);
      
      // Auto-focus next input if a character was entered
      if (value !== "" && index < 5) {
        setTimeout(() => {
          const nextInput = document.getElementById(`otp-${index + 1}`);
          if (nextInput) {
            nextInput.focus();
            console.log(`Focused next input: otp-${index + 1}`);
          }
        }, 10);
      }
    }
  };
  
  const handleOTPKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // If current input is empty, move to previous input
        setTimeout(() => {
          const prevInput = document.getElementById(`otp-${index - 1}`);
          prevInput?.focus();
        }, 0);
      } else if (otp[index]) {
        // If current input has value, clear it
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
    // Allow arrow key navigation
    else if (e.key === 'ArrowLeft' && index > 0) {
      setTimeout(() => {
        const prevInput = document.getElementById(`otp-${index - 1}`);
        prevInput?.focus();
      }, 0);
    }
    else if (e.key === 'ArrowRight' && index < 5) {
      setTimeout(() => {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }, 0);
    }
  };
  
  const verifyOTP = async () => {
    const otpCode = otp.join("");
    
    if (otpCode.length !== 6) {
      toast.error("Please enter complete 6-digit OTP");
      return;
    }
    
    setOtpLoading(true);
    try {
      const response = await axios.post(
        `${config.API_BASE_URL}/users/verify-email-otp`,
        { email: input.email, otpCode },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        }
      );
      
      if (response.data.success) {
        toast.success(response.data.message);
        setEmailVerified(true);
        setVerifiedEmail(input.email);
        setShowOTPDialog(false);
        setOtp(["", "", "", "", "", ""]);
        
        // Persist email verification status
        localStorage.setItem('ownerRequestVerifiedEmail', input.email);
        
        // Now create the owner request after email verification
        try {
          const ownerRequestResponse = await axios.post(
            `${config.API_BASE_URL}/owner-request/create-request`,
            {
              name: input.name,
              email: input.email,
              phone: input.phone
            },
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true
            }
          );
          
          if (ownerRequestResponse.data.success) {
            // Update user store with verified status
            const { updateUserOwnerStatus } = useUserStore.getState();
            updateUserOwnerStatus('verified');
            
            toast.success('Owner request created successfully!');
            
            // Redirect to verification status page after successful request creation
            setTimeout(() => {
              navigate('/owner-verification-status');
            }, 1500);
          }
        } catch (requestError: any) {
          console.error('Error creating owner request:', requestError);
          toast.error(requestError.response?.data?.message || 'Failed to create owner request');
        }
      }
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      toast.error(error.response?.data?.message || "OTP verification failed");
    } finally {
      setOtpLoading(false);
    }
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    // If email is not verified, the form validation should catch it
    // If all validations pass, this means email is verified and owner request was already created
    // So just redirect to status page
    navigate('/owner-verification-status');
  };

  if (isSubmitted) {
    return (
      <div className="max-w-6xl mx-auto my-10 px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <div className="text-green-500 text-5xl mb-4">✓</div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Request Submitted Successfully!</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            We've sent a verification email to <span className="font-semibold">{input.email}</span>. 
            Please check your inbox and click the verification link to complete the process.
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Once verified, you'll automatically become an owner and can start managing your restaurant.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto my-10 px-4 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Become a Restaurant Owner</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Fill out the form below to request restaurant ownership. After verification, 
            you'll be able to manage your restaurant directly.
          </p>
          
          <form onSubmit={submitHandler} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={input.name}
                onChange={changeEventHandler}
                placeholder="Enter your full name"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <span className="text-xs text-red-500">{errors.name}</span>
              )}
            </div>
            
            <div>
              <Label htmlFor="email">Email Address</Label>
              <div className="flex gap-2">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={input.email}
                  onChange={changeEventHandler}
                  placeholder="Enter your email address"
                  className={errors.email ? "border-red-500" : emailVerified ? "border-green-500" : ""}
                />
                {emailVerified ? (
                  <Button 
                    type="button"
                    disabled
                    className="bg-green-500 hover:bg-green-500 text-white px-4"
                  >
                    ✓ Verified
                  </Button>
                ) : (
                  <Button 
                    type="button"
                    onClick={sendEmailVerification}
                    disabled={verifyEmailLoading || !input.email.trim()}
                    className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white dark:text-white px-4 transition-colors duration-200"
                  >
                    {verifyEmailLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Verify Email"
                    )}
                  </Button>
                )}
              </div>
              {errors.email && (
                <span className="text-xs text-red-500">{errors.email}</span>
              )}
              {emailVerified && (
                <span className="text-xs text-green-500">✓ Email verified successfully</span>
              )}
            </div>
            
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={input.phone}
                onChange={changeEventHandler}
                placeholder="Enter your 10-digit phone number"
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && (
                <span className="text-xs text-red-500">{errors.phone}</span>
              )}
            </div>
            
            <div className="pt-4">
              {loading ? (
                <Button disabled className="w-full bg-orange hover:bg-hoverOrange">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  className="w-full bg-orange hover:bg-hoverOrange"
                >
                  Submit Request
                </Button>
              )}
            </div>
          </form>
        </div>
        
        {/* Right Side - Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Why Become an Owner?</h2>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-orange text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">Expand Your Business</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Reach thousands of customers in your area and grow your restaurant's presence online.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-orange text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">Easy Management</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Our intuitive dashboard makes it easy to manage menus, orders, and customer feedback.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-orange text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">Marketing Support</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Benefit from our marketing campaigns and promotional activities to attract more customers.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-orange text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">Secure Payments</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Enjoy hassle-free, secure payment processing with quick settlements to your account.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-orange/10 dark:bg-orange/20 rounded-lg">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Application Process</h3>
            <ul className="text-gray-600 dark:text-gray-300 text-sm list-disc pl-5 space-y-1">
              <li>Submit your request using the form</li>
              <li>Verify your email address through the link sent to your inbox</li>
              <li>Automatically become an owner upon verification</li>
              <li>Start managing your restaurant immediately</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* OTP Verification Dialog */}
      {showOTPDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={(e) => e.stopPropagation()}>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Verify Your Email</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                We've sent a 6-digit code to <span className="font-semibold">{input.email}</span>
              </p>
            </div>
            
            <div className="flex justify-center gap-2 mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOTPChange(index, e.target.value)}
                  onKeyDown={(e) => handleOTPKeyDown(index, e)}
                  autoComplete="off"
                  placeholder="0"
                  aria-label={`OTP digit ${index + 1}`}
                  className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-orange-500 focus:outline-none"
                  onFocus={(e) => {
                    e.target.select();
                  }}
                />
              ))}
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setShowOTPDialog(false);
                  setOtp(["", "", "", "", "", ""]);
                }}
                variant="outline"
                className="flex-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Cancel
              </Button>
              <Button
                onClick={verifyOTP}
                disabled={otpLoading}
                className="flex-1 bg-orange hover:bg-hoverOrange"
              >
                {otpLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Verify"
                )}
              </Button>
            </div>
            
            <div className="text-center mt-4">
              <Button
                onClick={sendEmailVerification}
                variant="link"
                disabled={verifyEmailLoading}
                className="text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors duration-200"
              >
                {verifyEmailLoading ? "Sending..." : "Resend OTP"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BecomeOwner;