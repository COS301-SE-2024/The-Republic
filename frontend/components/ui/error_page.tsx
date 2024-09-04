import React from "react";

interface ErrorSectionProps {
  message?: string;
  error?: string;
  showReloadButton?: boolean;
}

export function ErrorPage({
  message = "Connection lost.",
  error = "We couldn't establish a connection. Please check your network and try reloading the page.",
  showReloadButton = false
}: ErrorSectionProps) {
  return (
    <section>
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <p className="mb-4 text-3xl tracking-tight font-bold text-gray-700 md:text-4xl dark:text-white">
            {message}
          </p>
          <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
            {error}
          </p>
          {showReloadButton && (
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-md"
            >
              Reload Page
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export default ErrorPage;
