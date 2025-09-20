import {z} from "zod"

export const userSignUpSchema=z.object({
    fullName:z.string().min(1,"Full name is required"),
    email:z.string().email("Invalid email address"),
    password:z.string().min(6,"Password must contain at least 6 characters"),
    contact:z.string()
        .min(10,"Contact number must be at least 10 digits")
        .max(15,"Contact number is too long")
        .regex(/^[0-9+()-\s]*$/,"Invalid contact number format")
});
  export type SignUpInputState=z.infer <typeof userSignUpSchema>


  export const userLoginSchema=z.object({
   
    email:z.string().email("Invalid emial address "),
    password:z.string().min(6,"password must contain 6 letters"),

});
  export type LoginInputState=z.infer <typeof userLoginSchema>


  