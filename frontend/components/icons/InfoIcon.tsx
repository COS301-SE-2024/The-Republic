import * as React from "react";

function InfoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className="w-5 h-5 text-white"
      { ...props}
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
        d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
    </svg>  
  );
}

export default InfoIcon;
