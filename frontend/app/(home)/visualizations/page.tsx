import React from "react";
import dynamic from 'next/dynamic';

const EChartsComponent = dynamic(() => import('@/components/Visualisations/DotVisualizations'), {
  ssr: false
});

function page() {
  return (
    <section className="section align-center mb-5">
      <h3 className="mb-10 text-3xl font-extrabold leading-none tracking-tight text-gray-700 md:text-3xl lg:text-4xl dark:text-white text-center">
        Discover <span className="text-blue-600 dark:text-blue-500">Issues</span> faced Across Provinces.
      </h3>
      <div>
        <EChartsComponent />
      </div>
    </section>
  );
}

export default page;
