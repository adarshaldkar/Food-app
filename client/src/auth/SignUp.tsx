import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {  Loader2, LockKeyhole, Mail, Phone, User } from "lucide-react";
import { Separator } from "@radix-ui/react-separator";
import { ChangeEvent, FormEvent, useState } from "react";
import {  SignUpInputState, userSignUpSchema } from "@/schema/userSchema";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore} from '../store/useUserStore';
// import { toast } from 'sonner';

// type SignUpInputState = {
//     fullName: string
//   email: string;
//   password: string;
//   contract:string
// };

// const SignUp = () => {
//   const [input, setInput] = useState<SignUpInputState>({
//     fullName: "",
//     email: "",
//     password: "",
//     contract:"",
//   });
//   const [errors, setErrors] = useState<Partial<SignUpInputState>>({});
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const {signup,loading}=useUserStore();

//   const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setInput({ ...input, [name]: value });
//   };

//   const loginSubmitHandler = async (e: FormEvent) => {
//     e.preventDefault();
//     setIsSubmitted(true);
//     const result=userSignUpSchema.safeParse(input);
//         if(!result.success){
//           const fieldErrors=result.error.formErrors.fieldErrors;
//           setErrors(fieldErrors as Partial <SignUpInputState>);
//           return;
//         }
//         try {
//           await signup(input); // Wrap in try-catch to handle errors
//         } catch (error) {
//           console.error("Error during signup:", error); // Log the error
//           toast.error("Signup failed. Please try again."); // Notify the user
//         }
//   };



  const SignUp = () => {
    const [input, setInput] = useState<SignUpInputState>({
        fullName: "",
        email: "",
        password: "",
        contact: "",
    });
    const [errors, setErrors] = useState<Partial<SignUpInputState>>({});
    const {signup, loading} = useUserStore();
    const navigate = useNavigate();

    const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
    }
    const loginSubmitHandler = async (e: FormEvent) => {
        e.preventDefault();
        
        const result = userSignUpSchema.safeParse(input);
        if(!result.success){
            const fieldErrors = result.error.formErrors.fieldErrors;
            setErrors(fieldErrors as Partial<SignUpInputState>);
            return;
        }
        // login api implementation start here
        try {
          await signup(input);
          navigate("/verify-email");
        } catch (error) {
          console.log(error);
        }
    }




  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={loginSubmitHandler}
        className=" md:p-8 max-w-md w-full  md:border border-gray-200  rounded-lg mx-12 "
      >
        <div className="mb-4">
          <h1 className="font-bold text-2xl">SignUp</h1>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Enter your name"
              value={input.fullName}
              onChange={changeEventHandler}
              name="fullName"
              className="pl-10 focus-visible:ring-1"
            />
             <User className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
             { errors && <span className="text-xs text-red-500">{errors.fullName}</span>}
          </div>
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
            <Mail className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
            { errors && <span className="text-xs text-red-500">{errors.email}</span>}
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
            <LockKeyhole className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
            { errors && <span className="text-xs text-red-500">{errors.password}</span>}
          </div>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Contact number"
              value={input.contact}
              onChange={changeEventHandler}
              name="contact"
              className="pl-10 focus-visible:ring-1"
            />
            <Phone className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
            { errors && <span className="text-xs text-red-500">{errors.contact}</span>}
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
              SignUp
            </Button>
          )}
        </div>
        <Separator />
        <p>
          Already have an account? <Link to="/login" className="text-blue-500">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
