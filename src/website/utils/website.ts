 export async function validateUrl(url: string) {
    try {
      // Basic check if the URL is accessible
      const response = await fetch(url, { method: 'HEAD' });
      if (!response.ok) {
        throw new Error(`URL returned status ${response.status}`);
      }
      return response
    } catch (error) {
      throw new Error(`URL validation failed: ${error.message}`);
    }
  }

export async function fetchWebsiteContent(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch website content: ${response.statusText}`);
    }
    return await response.text();
  } catch (error) {
    throw new Error(`Failed to fetch website content: ${error.message}`);
  }
}