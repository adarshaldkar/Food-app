import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useUserStore } from "@/store/useUserStore";

const VerifyOwnerRequest = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { checkAuthentication } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/v1/owner-request/verify/${token}`,
          {
            withCredentials: true
          }
        );
        
        if (response.data.success) {
          setIsSuccess(true);
          setMessage(response.data.message);
          toast.success(response.data.message);
          
          // Update the user store by checking authentication
          await checkAuthentication();
          
          // Redirect to home page after a short delay
          setTimeout(() => {
            navigate("/");
          }, 3000);
        }
      } catch (error: any) {
        setIsSuccess(false);
        const errorMessage = error.response?.data?.message || "Verification failed";
        setMessage(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      verifyToken();
    }
  }, [token, navigate, checkAuthentication]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto my-10 px-4 flex justify-center items-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying your request...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto my-10 px-4">
      <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-2xl mx-auto">
        {isSuccess ? (
          <>
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <h2 className="text-2xl font-bold mb-4">Verification Successful!</h2>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            <p className="text-gray-500 mb-6">
              You will be redirected to the home page shortly. If you are not redirected automatically, 
              <button 
                onClick={() => navigate("/")} 
                className="text-orange-500 hover:underline ml-1"
              >
                click here
              </button>.
            </p>
          </>
        ) : (
          <>
            <div className="text-red-500 text-5xl mb-4">✗</div>
            <h2 className="text-2xl font-bold mb-4">Verification Failed</h2>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            <p className="text-gray-500 mb-6">
              The verification link may have expired or is invalid. Please try submitting your request again.
            </p>
          </>
        )}
        
        <button
          onClick={() => navigate("/")}
          className="bg-orange hover:bg-hoverOrange text-white font-bold py-2 px-6 rounded"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default VerifyOwnerRequest;