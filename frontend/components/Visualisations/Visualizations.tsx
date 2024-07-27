import React from "react";
import dynamic from "next/dynamic";

const EChartsComponent = dynamic(
  () => import("@/components/Visualisations/DotVisualizations"),
  {
    ssr: false,
  },
);

function Visualizations() {
  return (
    <section className="section align-center mb-5">
      <h3 className="mb-2 text-3xl font-extrabold leading-none tracking-tight text-gray-700 md:text-3xl lg:text-4xl dark:text-white text-center">
        Discover{" "}
        <span className="text-green-600 dark:text-green-500">Issues</span> faced
        Across Provinces.
      </h3>
      <p className="mb-6 text-center text-gray-600 dark:text-gray-400">
        This interactive visualization provides an overview of issues reported across different provinces and suburbs. 
        Click on a province to drill down and explore more detailed information.
      </p>
      <div>
        <EChartsComponent />
      </div>
    </section>
  );
}

export default Visualizations;