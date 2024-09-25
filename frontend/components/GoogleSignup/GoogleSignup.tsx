import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";

interface GoogleSignupProps {
  onSignup: () => void;
}

export default function GoogleSignup({ onSignup }: GoogleSignupProps) {
  return (
    <Button
      onClick={onSignup}
      className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 py-2 sm:py-3 text-base sm:text-lg rounded-md transition duration-300 flex items-center justify-center"
    >
      <FcGoogle className="mr-2" size={20} />
      Sign up with Google
    </Button>
  );
}