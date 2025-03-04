import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 relative">
      <Card className="w-96 shadow-xl p-6 bg-white rounded-2xl">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          {isSignUp ? "Sign Up" : "Sign In"}
        </h2>
        <p className="text-sm text-center text-gray-500 mb-4">
          Your Data, Your Control
        </p>
        <CardContent>
          <form className="space-y-4">
            {isSignUp && (
              <Input type="text" placeholder="Full Name" className="w-full" />
            )}
            <Input type="text" placeholder="12-Digit Unique ID" className="w-full" />
            <Input type="password" placeholder="Password" className="w-full" />
            {isSignUp && (
              <Input type="date" placeholder="Date of Birth" className="w-full" />
            )}
            {isSignUp && (
              <Input type="tel" placeholder="Mobile Number" className="w-full" />
            )}
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              {isSignUp ? "Sign Up" : "Sign In"}
            </Button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-4">
            {isSignUp ? "Already have an account?" : "Don't have an account?"} 
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? " Sign In" : " Sign Up"}
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
