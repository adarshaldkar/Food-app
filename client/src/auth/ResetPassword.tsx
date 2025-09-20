import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, LockKeyhole, } from "lucide-react";
import { useState } from "react"
import { Link, useParams } from "react-router-dom";
import { useUserStore } from "@/store/useUserStore";

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState<string>("");
    const { loading, resetPassword } = useUserStore();
    const { token } = useParams<{ token: string }>();
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (token && newPassword) {
            resetPassword(token, newPassword);
        }
    };
    
    return (
        <div className="flex items-center justify-center w-full min-h-screen">
            <form onSubmit={handleSubmit} className="flex flex-col rounded-lg md:p-8 w-full max-w-md">
                <div className="text-center">
                    <h1 className="font-extrabold text-2xl mb-4">Reset Password</h1>
                    <p className="text-sm text-gray-600">Enter your new password</p>
                </div>
                <div className="relative w-full mt-3">
                    <Input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="pl-10"
                    />
                    <LockKeyhole className="absolute top-2 left-2 pointer-events-none" />
                </div>
                {
                    loading ? (
                        <Button disabled className="w-full mt-4">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />Please wait
                        </Button>
                    ) : (
                        <Button type="submit" className="w-full mt-4 bg-orange hover:bg-hoverOrange">
                            Reset Password
                        </Button>
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

export default ResetPassword;