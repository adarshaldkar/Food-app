import React from 'react';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const OwnerVerificationStatus = () => {
  const { user } = useUserStore();
  const navigate = useNavigate();
  const ownerRequestStatus = user?.ownerRequestStatus || 'none';

  const getStatusContent = () => {
    switch (ownerRequestStatus) {
      case 'pending':
        return {
          icon: <Clock className="w-16 h-16 text-yellow-500" />,
          title: 'Verification Pending',
          message: 'Please verify your email by entering the OTP sent to your email address.',
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
          borderColor: 'border-yellow-200 dark:border-yellow-600'
        };
      
      case 'verified':
        return {
          icon: <CheckCircle className="w-16 h-16 text-blue-500" />,
          title: 'Email Verified',
          message: 'Your email has been verified successfully. Please wait 24-48 hours for admin approval.',
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          borderColor: 'border-blue-200 dark:border-blue-600'
        };
      
      case 'approved':
        return {
          icon: <CheckCircle className="w-16 h-16 text-green-500" />,
          title: 'Request Approved!',
          message: 'Congratulations! Your owner request has been approved. You now have access to the admin dashboard.',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-600'
        };
      
      case 'rejected':
        return {
          icon: <XCircle className="w-16 h-16 text-red-500" />,
          title: 'Request Rejected',
          message: 'Unfortunately, your owner request has been rejected. You can submit a new request if needed.',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-600'
        };
      
      default:
        return {
          icon: <Clock className="w-16 h-16 text-gray-500" />,
          title: 'No Request Found',
          message: 'You haven\'t submitted an owner request yet.',
          bgColor: 'bg-gray-50 dark:bg-gray-800',
          borderColor: 'border-gray-200 dark:border-gray-600'
        };
    }
  };

  const { icon, title, message, bgColor, borderColor } = getStatusContent();

  return (
    <div className="max-w-2xl mx-auto my-10 px-4">
      <div className={`${bgColor} ${borderColor} border rounded-lg shadow-md p-8 text-center`}>
        <div className="flex justify-center mb-6">
          {icon}
        </div>
        
        <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">{title}</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">{message}</p>
        
        {ownerRequestStatus === 'pending' && (
          <Button 
            onClick={() => navigate('/verify-owner-otp')}
            className="bg-orange hover:bg-hoverOrange"
          >
            Verify Email
          </Button>
        )}
        
        {ownerRequestStatus === 'verified' && (
          <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-blue-200 dark:border-blue-600">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-2">What happens next?</h3>
            <ul className="text-gray-600 dark:text-gray-300 text-sm list-disc pl-5 space-y-1 text-left">
              <li>Admin will review your request within 24-48 hours</li>
              <li>You'll receive an email notification about the decision</li>
              <li>If approved, you'll automatically gain access to the dashboard</li>
              <li>You can check this page anytime to see your status</li>
            </ul>
          </div>
        )}
        
        {ownerRequestStatus === 'approved' && (
          <Button 
            onClick={() => navigate('/admin/restaurant')}
            className="bg-green-600 hover:bg-green-700"
          >
            Go to Dashboard
          </Button>
        )}
        
        {(ownerRequestStatus === 'rejected' || ownerRequestStatus === 'none') && (
          <Button 
            onClick={() => navigate('/become-owner')}
            className="bg-orange hover:bg-hoverOrange"
          >
            {ownerRequestStatus === 'rejected' ? 'Submit New Request' : 'Become an Owner'}
          </Button>
        )}
        
        <div className="mt-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OwnerVerificationStatus;