const checkContentAppropriateness = async (
    text: string,
  ): Promise<boolean> => {

    const apiKey = process.env
      .NEXT_PUBLIC_AZURE_CONTENT_MODERATOR_KEY as string;
    const url = process.env.NEXT_PUBLIC_AZURE_CONTENT_MODERATOR_URL as string;

  const headers = {
    "Ocp-Apim-Subscription-Key": apiKey,
    "Content-Type": "text/plain",
  };

  const response = await fetch(`${url}`, {
    method: "POST",
    headers,
    body: text,
  });

  const result = await response.json();

    if (
      (result.Terms && result.Terms.length > 0) ||
      result.Classification.Category1.Score > 0.5 ||
      result.Classification.Category2.Score > 0.5 ||
      result.Classification.Category3.Score > 0.5
    ) {
      return false;
    }

    return text.length > 0;
};

export { checkContentAppropriateness };
