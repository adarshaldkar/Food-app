import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useState, useRef, FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { useUserStore } from "@/store/useUserStore";
import { config } from "@/config/env";

const VerifyOwnerOTP = () => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const inputRef = useRef<any>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { checkAuthentication } = useUserStore();
  
  // Get email from location state (passed from BecomeOwner component)
  const email = location.state?.email || "";

  const handleChange = (index: number, value: string) => {
    // Allow alphanumeric characters (letters and numbers) - FIXED
    if (/^[a-zA-Z0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value; // Keep original case - FIXED
      setOtp(newOtp);
      
      // Auto-focus next input if a character was entered
      if (value !== "" && index < 5) {
        setTimeout(() => {
          inputRef.current[index + 1]?.focus();
        }, 0);
      }
    }
  };

  // Handle paste functionality - NEW
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    
    if (/^[a-zA-Z0-9]{1,6}$/.test(pastedData)) {
      const newOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pastedData[i] || "";
      }
      setOtp(newOtp);
      
      // Focus the last filled input
      const lastIndex = Math.min(pastedData.length - 1, 5);
      setTimeout(() => {
        inputRef.current[lastIndex]?.focus();
      }, 0);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // If current input is empty, move to previous input
        setTimeout(() => {
          inputRef.current[index - 1]?.focus();
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
        inputRef.current[index - 1]?.focus();
      }, 0);
    }
    else if (e.key === 'ArrowRight' && index < 5) {
      setTimeout(() => {
        inputRef.current[index + 1]?.focus();
      }, 0);
    }
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otpCode: string = otp.join("");
    
    if (otpCode.length !== 6) {
      toast.error("Please enter complete 6-character verification code");
      return;
    }

    if (!email) {
      toast.error("Email not found. Please go back and submit the form again.");
      return;
    }

    console.log("Submitting OTP verification:", { email, otpCode });
    setLoading(true);
    
    try {
      const response = await axios.post(
        `${config.API_BASE_URL}/owner-request/verify-otp`,
        {
          email: email,
          otpCode: otpCode // Send with original case - FIXED
        },
        {
          headers: {
            "Content-Type": "application/json"
          },
          withCredentials: true
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        
        // Update user authentication state
        await checkAuthentication();
        
        // Redirect to verification status page
        navigate("/owner-verification-status");
      }
    } catch (error: any) {
      console.error("OTP verification error:", error);
      toast.error(error.response?.data?.message || "Verification code is incorrect");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email) {
      toast.error("Email not found. Please go back and submit the form again.");
      return;
    }

    setResendLoading(true);
    try {
      const response = await axios.post(
        `${config.API_BASE_URL}/owner-request/resend-otp`,
        {
          email: email
        },
        {
          headers: {
            "Content-Type": "application/json"
          },
          withCredentials: true
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        // Clear the current OTP input
        setOtp(["", "", "", "", "", ""]);
        inputRef.current[0]?.focus();
      }
    } catch (error: any) {
      console.error("Resend OTP error:", error);
      toast.error(error.response?.data?.message || "Failed to resend verification code");
    } finally {
      setResendLoading(false);
    }
  };

  const goBack = () => {
    navigate("/become-owner");
  };

  return (
    <div className="flex justify-center items-center h-screen w-full bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col rounded-md max-w-md w-full p-8 gap-6 border border-orange-300 dark:border-orange-600 bg-white dark:bg-gray-800 shadow-lg">
        <div className="text-center">
          <h1 className="font-extrabold text-2xl text-gray-800 dark:text-gray-100">
            Verify Your Email
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            We've sent a 6-character verification code to
          </p>
          <p className="text-sm font-semibold text-orange-600 dark:text-orange-400 mt-1">
            {email || "your email address"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Enter the code below (letters and numbers) to become a restaurant owner
          </p>
        </div>
        
        <form onSubmit={submitHandler}>
          <div className="flex justify-between mt-4 gap-2">
            {otp.map((letter: string, idx: number) => (
              <Input
                type="text"
                key={idx}
                ref={(element) => (inputRef.current[idx] = element)}
                maxLength={1}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(idx, e.target.value)
                }
                onPaste={idx === 0 ? handlePaste : undefined} // Only allow paste on first input
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                  handleKeyDown(idx, e)
                }
                onFocus={(e) => e.target.select()}
                value={letter}
                autoComplete="off"
                style={{ textTransform: 'none' }} // Prevent uppercase transformation - FIXED
                className="w-12 h-12 text-center text-2xl font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 border-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            ))}
          </div>
          
          <div className="mt-6">
            {loading ? (
              <Button
                disabled
                className="bg-orange hover:bg-hoverOrange w-full"
              >
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                Verifying...
              </Button>
            ) : (
              <Button 
                type="submit"
                className="bg-orange hover:bg-hoverOrange w-full"
              >
                Verify Code
              </Button>
            )}
          </div>
        </form>
        
        <div className="text-center space-y-3">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Didn't receive the code?
          </div>
          <div className="flex gap-2 justify-center">
            {resendLoading ? (
              <Button 
                disabled 
                variant="outline" 
                size="sm"
                className="text-orange-600 border-orange-600"
              >
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                Sending...
              </Button>
            ) : (
              <Button 
                onClick={handleResendOTP}
                variant="outline" 
                size="sm"
                className="text-orange-600 border-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900"
              >
                Resend Code
              </Button>
            )}
            <Button 
              onClick={goBack}
              variant="outline" 
              size="sm"
              className="text-gray-600 border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-400 dark:border-gray-600"
            >
              Go Back
            </Button>
          </div>
          
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            Verification code expires in 10 minutes
          </div>
          
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
            💡 Tip: You can paste the entire code from your email, or type each character individually
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOwnerOTP;