import React from "react";
import dynamic from "next/dynamic";
import { useMediaQuery } from "@/lib/useMediaQuery";

const EChartsComponent = dynamic(
  () => import("@/components/Visualisations/DotVisualizations"),
  {
    ssr: false,
  },
);

function Visualizations() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <section className="section align-center mb-5 px-4">
      <h3 className={`mb-2 font-extrabold leading-none tracking-tight text-gray-700 dark:text-white text-center ${isMobile ? 'text-2xl' : 'text-3xl md:text-3xl lg:text-4xl'}`}>
        Discover{" "}
        <span className="text-green-600 dark:text-green-500">Issues</span> faced
        Across Provinces.
      </h3>
      <p className={`mb-6 text-center text-gray-600 dark:text-gray-400 ${isMobile ? 'text-sm' : 'text-base'}`}>
        This interactive visualization provides an overview of issues reported across different provinces and suburbs. 
        Click on a province to drill down and explore more detailed information.
      </p>
      <div className={isMobile ? 'h-[80vh]' : 'h-[100vh]'}>
        <EChartsComponent />
      </div>
    </section>
  );
}

export default Visualizations;