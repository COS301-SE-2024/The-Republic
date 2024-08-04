import * as React from "react";

function TrophyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className="w-6 h-6 text-gray-800 dark:text-white"
      {...props}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M8 21h8m-4-4v4m-5-7.5c3.5 2 7.5 2 11 0M6.5 3h11a1.5 1.5 0 0 1 1.5 1.5v3c0 3.044-2.456 5.5-5.5 5.5h-3A5.5 5.5 0 0 1 5 7.5v-3A1.5 1.5 0 0 1 6.5 3z"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M5 4.5h-.5A2.5 2.5 0 0 0 2 7v1.5A4.5 4.5 0 0 0 6.5 13M19 4.5h.5a2.5 2.5 0 0 1 2.5 2.5v1.5A4.5 4.5 0 0 1 17.5 13"
      />
    </svg>
  );
}

export default TrophyIcon;