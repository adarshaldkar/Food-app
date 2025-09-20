import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2, User, Mail, Phone, Calendar, CheckCircle, XCircle, Clock } from "lucide-react";

interface OwnerRequest {
  _id: string;
  userId?: string;
  name: string;
  email: string;
  phone: string;
  isVerified: boolean;
  status: "pending" | "approved" | "rejected";
  adminNote?: string;
  createdAt: string;
}

const OwnerRequests = () => {
  const [requests, setRequests] = useState<OwnerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5001/api/v1/owner-request",
        {
          withCredentials: true,
        }
      );
      
      if (response.data.success) {
        setRequests(response.data.requests);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateRequestStatus = async (
    requestId: string,
    status: "approved" | "rejected",
    adminNote?: string
  ) => {
    setActionLoading(requestId);
    try {
      const response = await axios.put(
        `http://localhost:5001/api/v1/owner-request/${requestId}/status`,
        { status, adminNote },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      if (response.data.success) {
        toast.success(response.data.message);
        // Update the request in the local state
        setRequests(prev => 
          prev.map(req => 
            req._id === requestId 
              ? { ...req, status, adminNote } 
              : req
          )
        );
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update request");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto my-10 px-4">
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto my-8 px-4 sm:px-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Restaurant Owner Requests
      </h1>
      
      {requests.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">No owner requests found</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Verified
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {requests.map((request) => (
                  <tr key={request._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {request.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {request.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {request.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        request.status === "pending"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200"
                          : request.status === "approved"
                          ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200"
                      }`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {request.isVerified ? (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200">
                          Verified
                        </span>
                      ) : (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200">
                          Not Verified
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {request.status === "pending" && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              const note = prompt("Add an admin note (optional):");
                              updateRequestStatus(request._id, "approved", note || undefined);
                            }}
                            disabled={actionLoading === request._id}
                            className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                          >
                            {actionLoading === request._id ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Approving...
                              </>
                            ) : (
                              "Approve"
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              const note = prompt("Reason for rejection (optional):");
                              updateRequestStatus(request._id, "rejected", note || undefined);
                            }}
                            disabled={actionLoading === request._id}
                          >
                            {actionLoading === request._id ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Rejecting...
                              </>
                            ) : (
                              "Reject"
                            )}
                          </Button>
                        </div>
                      )}
                      {request.status !== "pending" && (
                        <span className="text-gray-500 dark:text-gray-400 text-sm">
                          {request.status === "approved" ? "Approved" : "Rejected"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {requests.map((request) => (
              <div key={request._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
                {/* Header with Name and Status */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-full">
                      <User className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {request.name}
                      </h3>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      request.status === "pending"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200"
                        : request.status === "approved"
                        ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200"
                        : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200"
                    }`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                    {request.isVerified ? (
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200">
                        Verified
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200">
                        Not Verified
                      </span>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {request.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {request.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  {request.status === "pending" ? (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        className="flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                        onClick={() => {
                          const note = prompt("Add an admin note (optional):");
                          updateRequestStatus(request._id, "approved", note || undefined);
                        }}
                        disabled={actionLoading === request._id}
                      >
                        {actionLoading === request._id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Approving...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Approve Request
                          </>
                        )}
                      </Button>
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={() => {
                          const note = prompt("Reason for rejection (optional):");
                          updateRequestStatus(request._id, "rejected", note || undefined);
                        }}
                        disabled={actionLoading === request._id}
                      >
                        {actionLoading === request._id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Rejecting...
                          </>
                        ) : (
                          <>
                            <XCircle className="mr-2 h-4 w-4" />
                            Reject Request
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-2">
                      <span className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-2">
                        {request.status === "approved" ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            Request Approved
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 text-red-500" />
                            Request Rejected
                          </>
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default OwnerRequests;