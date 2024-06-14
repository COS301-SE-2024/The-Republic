import * as React from "react";

function logoutIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            className="w-6 h-6 text-gray-800 dark:text-white"
            {...props}
            aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
            fill="none" viewBox="0 0 24 24"
        >
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2"/>
        </svg>
    );
}

export default logoutIcon;
