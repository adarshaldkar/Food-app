import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormEvent, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRef = useRef<any>([]);

  const { loading, VerifyEmail } = useUserStore();
  const navigate = useNavigate();

  const handleChange = (index: number, value: string) => {
    console.log('Input value:', value, 'Test result:', /^[a-zA-Z0-9]*$/.test(value));
    
    // Allow alphanumeric characters (letters and numbers) - FIXED
    if (/^[a-zA-Z0-9]?$/.test(value)) {
      const newOtp = [...otp];
      // Keep original case - FIXED (removed toUpperCase)
      newOtp[index] = value;
      setOtp(newOtp);
      console.log('Updated OTP:', newOtp);
      
      // Move to next input if current input has a value and not the last input
      if (value && index < 5) {
        inputRef.current[index + 1]?.focus();
      }
    } else {
      console.log('Input rejected:', value);
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

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const verificationCode: string = otp.join("");
    console.log("Submitting verification code:", verificationCode);
    
    if (verificationCode.length !== 6) {
      console.log("Verification code must be 6 characters");
      return;
    }
    
    try {
      await VerifyEmail(verificationCode);
      // Check if user has owner request status to redirect appropriately
      const updatedUser = useUserStore.getState().user;
      if (updatedUser?.ownerRequestStatus && updatedUser.ownerRequestStatus !== 'none') {
        navigate("/owner-verification-status");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // If current input is empty, move to previous input
        inputRef.current[index - 1].focus();
      } else if (otp[index]) {
        // If current input has value, clear it
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
    // Allow arrow key navigation
    else if (e.key === 'ArrowLeft' && index > 0) {
      inputRef.current[index - 1]?.focus();
    }
    else if (e.key === 'ArrowRight' && index < 5) {
      inputRef.current[index + 1]?.focus();
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-full bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col rounded-md max-w-md w-full p-8 gap-10 border border-green-300 dark:border-green-600 bg-white dark:bg-gray-800 shadow-lg">
        <div className="text-center">
          <h1 className="font-extrabold text-2xl text-gray-900 dark:text-gray-100">
            Verify Your Email
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            Enter the 6-character code (letters and numbers)
          </p>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
            💡 Tip: You can paste the entire code from your email
          </div>
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
                className="md:w-12 md:h-12 w-8 h-8 text-center text-sm md:text-2xl font-normal md:font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            ))}
          </div>
          
          {loading ? (
            <Button
              disabled
              className="bg-orange hover:bg-hoverOrange mt-6 w-full"
            >
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button className="bg-orange hover:bg-hoverOrange mt-6 w-full">
              Verify
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;
