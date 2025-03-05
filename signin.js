import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AuthPage() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [UID, setUID] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Unique ID submitted:", UID);
    // Send UID to backend here
  };

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen bg-black text-white relative"
      onClick={() => setShowSignIn(false)}
    >
      <div className="absolute top-4 right-4">
        <Button 
          className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-300"
          onClick={(e) => {
            e.stopPropagation();
            setShowSignIn(true);
          }}
        >
          Sign In
        </Button>
      </div>
      <h1 className="text-5xl font-mono font-bold">DocLoc</h1>
      <p className="text-xl mt-2">Your Data, Your Control</p>
      {showSignIn && (
        <div 
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setShowSignIn(false)}
        >
          <div 
            className="bg-black border border-white shadow-xl p-6 rounded-2xl w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-center">{isSignUp ? "Sign Up" : "Sign In"}</h2>
            <p className="text-sm text-center text-gray-400 mb-4">Your Data, Your Control</p>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                {isSignUp && (
                  <Input type="text" placeholder="Full Name" className="w-full bg-black text-white border border-white" />
                )}
                <Input 
                  type="text" 
                  placeholder="12-Digit Unique ID" 
                  className="w-full bg-black text-white border border-white"
                  value={UID}
                  onChange={(e) => setUID(e.target.value)}
                />
                <Input type="password" placeholder="Password" className="w-full bg-black text-white border border-white" />
                {isSignUp && (
                  <Input type="date" placeholder="Date of Birth" className="w-full bg-black text-white border border-white" />
                )}
                {isSignUp && (
                  <Input type="tel" placeholder="Mobile Number" className="w-full bg-black text-white border border-white" />
                )}
                <Button type="submit" className="w-full bg-white text-black hover:bg-gray-300">
                  {isSignUp ? "Sign Up" : "Sign In"}
                </Button>
              </form>
              <p className="text-center text-sm text-gray-400 mt-4">
                {isSignUp ? "Already have an account?" : "Don't have an account?"} 
                <span
                  className="text-white cursor-pointer"
                  onClick={() => setIsSignUp(!isSignUp)}
                >
                  {isSignUp ? " Sign In" : " Sign Up"}
                </span>
              </p>
            </CardContent>
          </div>
        </div>
      )}
    </div>
  );
}
