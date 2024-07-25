const reportCharts = async (url: string) => {
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      from: 0,
      amount: 99,
    }),
    headers: {
      "content-type": "application/json",
    },
  });

  const apiResponse = await response.json();

  if (apiResponse.success && apiResponse.data) {
    return apiResponse.data;
  } else {
    throw new Error(apiResponse.error || "Error fetching Data");
  }
};

export { reportCharts };
