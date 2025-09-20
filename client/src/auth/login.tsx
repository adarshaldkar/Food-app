import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {  Loader2, LockKeyhole, Mail } from "lucide-react";
// import { Separator } from "@radix-ui/react-separator";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { LoginInputState, userLoginSchema } from "@/schema/userSchema";
import { Link, useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { useUserStore } from "@/store/useUserStore";

// type loginInputState = {
//   email: string;
//   password: string;
// };

const Login = () => {
  const [input, setInput] = useState<LoginInputState>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<LoginInputState>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {loading,login}=useUserStore();
  const navigate=useNavigate();
  
  // Test API connectivity on component mount
  React.useEffect(() => {
    const testAPIConnectivity = async () => {
      try {
        console.log('Testing API connectivity...');
        const response = await fetch('http://localhost:5001/api/v1/orders/test');
        const data = await response.json();
        console.log('API connectivity test result:', data);
      } catch (error) {
        console.error('API connectivity test failed:', error);
      }
    };
    
    testAPIConnectivity();
  }, []);

  const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const loginSubmitHandler = async(e: FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    const result = userLoginSchema.safeParse(input);
    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setErrors(fieldErrors as Partial<LoginInputState>);
      return;
    }
    try {
      console.log('Starting login attempt...');
      await login(input);
      console.log('Login successful, navigating...');
      navigate("/");
    } catch (error) {
      console.log('Login error caught in component:', error)
    }


  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={loginSubmitHandler}
        className=" md:p-8 max-w-md w-full  md:border border-gray-200  rounded-lg mx-12 ">

        <div className="mb-4">
          <h1 className="font-bold text-2xl">Login</h1>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Input
              type="email"
              placeholder="Enter your Email"
              value={input.email}
              onChange={changeEventHandler}
              name="email"
              className="pl-10 focus-visible:ring-1"
            />
            <Mail className="absolute inset-y-2 left-2 text-grey-500 pointer-events-none" />
            {isSubmitted && errors.email && (
              <span className="text-sm text-red-500">{errors.email}</span>
            )}
          </div>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Input
              type="password"
              placeholder="Enter your Password"
              value={input.password}
              onChange={changeEventHandler}
              name="password"
              className="pl-10 focus-visible:ring-1"
            />
            <LockKeyhole className="absolute inset-y-2 left-2 top-2 text-grey-500 pointer-events-none" />
            {isSubmitted && errors.password && (
              <span className="text-sm text-red-500">{errors.password}</span>
            )}
          </div>
        </div>
        
        <div className="mb-10">
          {loading ? (
            <Button disabled className="bg-orange hover:bg-hoverOrange w-full">
              <Loader2 className="mr-4 h-2 w-2 animate-spin" />
              Please wait
              
            </Button>
          ) : (
            <Button type="submit" className="bg-orange hover:bg-hoverOrange w-full">
              Login
            </Button>
          )}
          <div  className="mt-4 text-blue-400 hover:underline">
          <Link to="/forgot-password">Forgot Password</Link>

          </div>
        </div>
        <Separator />
        <p>
          Don't have an account<Link to="/SignUp">SignUp</Link>
        </p>
      <p className="text-gray-400">For Login in Admin Use : adarshaldkar@gmail.com</p>
      <p className="text-gray-400">Password : asd123</p>
      </form>
    </div>
  );
};

export default Login;
