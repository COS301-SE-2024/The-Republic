import React from "react";
import dynamic from 'next/dynamic';

const EChartsComponent = dynamic(() => import('@/components/Visualisations/DotVisualizations'), {
  ssr: false
});

function page() {
  return (
    <div>
      <h1>Number of issues per location</h1>
      <EChartsComponent />
    </div>
  );
}

export default page;
