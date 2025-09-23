import {create} from 'zustand';
import {createJSONStorage,persist} from 'zustand/middleware';
import axios from 'axios';
import { LoginInputState, SignUpInputState } from '@/schema/userSchema';
import { toast } from 'sonner';
import { config } from '@/config/env';
// import VerifyEmail from '@/auth/VerifyEmail';

// API endpoint
const API_END_POINT = `${config.API_BASE_URL}/users`;
axios.defaults.withCredentials=true;
type User = {
  fullName: string;
  email: string;
  contact: string;
  address: string;
  city: string;
  country: string;
  profilePicture: string;
  admin: boolean;
  isVerified: boolean;
  ownerRequestStatus?: 'none' | 'pending' | 'verified' | 'approved' | 'rejected';
  emailVerified?: boolean;
  lastLogin?: Date;
}

type UserState = {
  user: User | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  loading: boolean;
  signup: (input:SignUpInputState) => Promise<void>;
  login: (input:LoginInputState) => Promise<void>;
  VerifyEmail: (verificationCode: string) => Promise<void>;
  checkAuthentication: () => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email:string) => Promise<void>; 
  resetPassword: (token:string, newPassword:string) => Promise<void>; 
  updateProfile: (input:any) => Promise<void>;
  updateUserOwnerStatus: (status: string) => void;
}

export const useUserStore = create<UserState>()(persist((set)=>({
  user:null,
  isAuthenticated:false,
  isCheckingAuth:true,
  loading:false,
  // api implementation 
  signup:async(input:SignUpInputState)=>{
    try {
      set({loading:true})
      const response =await axios.post(`${API_END_POINT}/signup`,input,{
        headers:{
          'Content-Type': 'application/json'
        },
          
      });
      

      if(response.data.success){
        toast.success(response.data.message)
        set({loading:false,user:response.data.user,isAuthenticated:true})
      }
     
    } 
    catch (error:any) {
      toast.error(error.response?.data?.message || "Signup failed. Please try again.");
      set({loading:false});
    }
  },
  login:async(input:LoginInputState)=>{
    try {
      console.log('Login attempt with:', { email: input.email, password: '***' });
      set({loading:true})
      
      const response = await axios.post(`${API_END_POINT}/login`, input, {
        headers:{
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      });

      console.log('Login response:', response.data);
      
      if(response.data.success){
        toast.success(response.data.message);
        set({loading:false,user:response.data.user,isAuthenticated:true});
        
        // Clear restaurant cache when user logs in (to ensure fresh data)
        const { useRestaurantStore } = await import('./useRestaurantStore');
        useRestaurantStore.getState().clearRestaurantCache();
      }
     
    } 
    catch (error:any) {
      console.log('=== LOGIN ERROR DEBUG ===');
      console.log('Full error object:', error);
      console.log('Error message:', error.message);
      console.log('Error response:', error.response);
      console.log('Error response data:', error.response?.data);
      console.log('Error response status:', error.response?.status);
      console.log('Error response headers:', error.response?.headers);
      
      // Try to get the most specific error message
      let errorMessage = "Login failed. Please try again.";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      console.log('Final error message:', errorMessage);
      
      toast.error(errorMessage);
      set({loading:false});
    }
  },
  VerifyEmail:async(verificationCode:string)=>{
    try {
      set({loading:true});
      const response =await axios.post(`${API_END_POINT}/verify-email`, { verificationCode }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if(response.data.success){
        toast.success(response.data.message);
        set({loading:false,user:response.data.user,isAuthenticated:true})
      }
      // return response.data;
    } catch (error:any) {
      toast.error(error.response?.data?.message || "Verifiaction failed. Please try again.");
      set({loading:false});
      
    }

  },
  checkAuthentication:async()=>{
try {
  set({isCheckingAuth:true});
  const response =await axios.get(`${API_END_POINT}/checkAuth`,{
    withCredentials: true 
  });
  if(response.data.success){
    set({user:response.data.user,isAuthenticated:true,isCheckingAuth:false})
  }
  
} catch (error) {
  set({isAuthenticated:false,isCheckingAuth:false})
  
}
  },
  logout: async () => {
    try {
        set({ loading: true });
        const response = await axios.post(`${API_END_POINT}/logout`);
        if (response.data.success) {
            toast.success(response.data.message);
            set({ loading: false, user: null, isAuthenticated: false });
            
            // Clear restaurant cache when user logs out
            const { useRestaurantStore } = await import('./useRestaurantStore');
            useRestaurantStore.getState().clearRestaurantCache();
        }
    } catch (error:any) {
        toast.error(error.response?.data?.message || "Logout failed. Please try again.");
        set({ loading: false });
    }
},
forgotPassword: async (email: string) => {
  try {
      set({ loading: true });
      const response = await axios.post(`${API_END_POINT}/forgot-password`, { email });
      if (response.data.success) {
          toast.success(response.data.message);
          set({ loading: false });
      }
  } catch (error: any) {
      toast.error(error.response?.data?.message || "Forgot password failed. Please try again.");
      set({ loading: false });
  }
},
resetPassword: async (token: string, newPassword: string) => {
  try {
      set({ loading: true });
      const response = await axios.post(`${API_END_POINT}/reset-password/${token}`, { newPassword });
      if (response.data.success) {
          toast.success(response.data.message);
          set({ loading: false });
      }
  } catch (error: any) {
      toast.error(error.response?.data?.message || "Reset password failed. Please try again.");
      set({ loading: false });
  }
},
updateProfile: async (input:any) => {
  try { 
      const response = await axios.put(`${API_END_POINT}/profile/update`, input,{
          headers:{
              'Content-Type':'application/json'
          }
      });
      if(response.data.success){
          toast.success(response.data.message);
          set({user:response.data.user, isAuthenticated:true});
      }
  } catch (error:any) { 
      toast.error(error.response?.data?.message || "Profile update failed. Please try again.");
  }
},

updateUserOwnerStatus: (status: string) => {
  set((state) => ({
    user: state.user ? {
      ...state.user,
      ownerRequestStatus: status as any
    } : null
  }));
}

}),

{
    name:'user-name',
    storage:createJSONStorage(()=>localStorage)
    
}
))



