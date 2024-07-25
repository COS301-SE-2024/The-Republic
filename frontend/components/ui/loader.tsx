import { FaSpinner } from "react-icons/fa";

const LoadingIndicator = () => (
  <div className="flex justify-center items-center h-24">
    <FaSpinner className="animate-spin text-4xl text-green-500" />
  </div>
);

export default LoadingIndicator;
