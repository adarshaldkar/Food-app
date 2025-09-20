import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail,Loader2, } from "lucide-react";
import { useState } from "react"
import { Link } from "react-router-dom";
import { useUserStore } from "@/store/useUserStore";

const ForgotPassword = () => {
  const[email,setEmail]=useState<string>("");
  const { loading, forgotPassword } = useUserStore();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      forgotPassword(email);
    }
  };
  
  return (
    <div className="flex items-center justify-center w-full min-h-screen">
      <form onSubmit={handleSubmit} className="flex flex-col rounded-lg md:p-8 w-full max-w-md">
        <div className="text-center">
          <h1 className="font-extrabold text-2xl mb-4">Forgot Password</h1>
          <p className="text-sm text-gray-600">Enter your email to reset your password</p>
        </div>
        <div className="relative w-full mt-3">
          <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className=" pl-10 "
          />
          <Mail className="absolute top-2 left-2 pointer-events-none"/>
        </div>
        {
          loading ? (
            <Button disabled className="w-full mt-4"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Please wait</Button>
          ) : (
            <Button type="submit" className="w-full mt-4 bg-orange hover:bg-hoverOrange">Send Reset Link</Button>
          )
        }
        <span className="mt-4 text-center">
          Back To {" "}
          <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
        </span>
      </form>
    </div>
  );
};

export default ForgotPassword