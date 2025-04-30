/**
 * Represents the status of a website.
 */
export interface WebsiteStatus {
  /**
   * The URL of the website.
   */
  url: string;
  /**
   * Indicates whether the website is currently up (true) or down (false).
   */
  isUp: boolean;
  /**
   * The HTTP status code returned when checking the website. Null if fetch failed.
   */
  statusCode: number | null;
  /**
    * Error message if the check failed.
    */
  error?: string | null;
}


/**
 * Asynchronously checks the uptime status of a given URL.
 * Simulates network request and potential failures.
 *
 * NOTE: This function runs client-side in this example.
 * In a real application, this check SHOULD ideally run on a server/backend
 * to avoid CORS issues, ensure reliability, and manage intervals centrally.
 * Browser-based checks are less reliable due to network variations and browser limitations.
 *
 * @param url The URL to check.
 * @returns A promise that resolves to a WebsiteStatus object.
 */
export async function checkWebsiteStatus(url: string): Promise<WebsiteStatus> {
  // console.log(`Checking status for: ${url}`); // For debugging

  // --- IMPORTANT LIMITATION ---
  // Direct fetch from browser to arbitrary URLs is often blocked by CORS.
  // This simulation might not accurately reflect real-world fetching capabilities
  // without a backend proxy or server-side checks.
  // We'll simulate success/failure randomly for demonstration.

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));

  // Simulate potential fetch errors (network issue, CORS block, DNS error etc.)
  if (Math.random() < 0.1) { // 10% chance of fetch error
     const errorMsg = "Simulated network error (e.g., DNS, CORS, offline)";
     console.warn(`Simulated fetch error for ${url}: ${errorMsg}`);
     return {
       url: url,
       isUp: false,
       statusCode: null, // No status code available
       error: errorMsg,
     };
  }


  // Simulate different HTTP responses
  const randomStatus = Math.random();
  let simulatedStatusCode: number;
  let simulatedIsUp: boolean;

  if (randomStatus < 0.8) { // 80% chance of success (2xx)
    simulatedStatusCode = 200;
    simulatedIsUp = true;
  } else if (randomStatus < 0.9) { // 10% chance of client error (4xx)
    simulatedStatusCode = [400, 401, 403, 404][Math.floor(Math.random() * 4)];
    simulatedIsUp = false;
  } else { // 10% chance of server error (5xx)
    simulatedStatusCode = [500, 502, 503][Math.floor(Math.random() * 3)];
    simulatedIsUp = false;
  }

   // console.log(`Simulated result for ${url}: Status ${simulatedStatusCode}, IsUp: ${simulatedIsUp}`);

  return {
    url: url,
    isUp: simulatedIsUp,
    statusCode: simulatedStatusCode,
    error: !simulatedIsUp ? `Simulated HTTP Error ${simulatedStatusCode}` : null
  };


  /*
  // --- Actual Fetch Implementation (Likely to hit CORS issues) ---
  try {
    // Using 'no-cors' mode means we won't get the actual status code or response body,
    // only know if the request could be made. Opaque responses always have status 0.
    // This isn't very useful for uptime monitoring.
    // const response = await fetch(url, { method: 'HEAD', mode: 'no-cors', cache: 'no-store', redirect: 'follow' });

    // A proper CORS-enabled request (if the target server allows it)
     const response = await fetch(url, { method: 'HEAD', cache: 'no-store', redirect: 'follow', signal: AbortSignal.timeout(5000) }); // 5 second timeout


    return {
      url: url,
      isUp: response.ok, // status in the range 200-299
      statusCode: response.status,
      error: !response.ok ? response.statusText : null
    };
  } catch (error: any) {
    console.error(`Fetch failed for ${url}:`, error);
    return {
      url: url,
      isUp: false,
      statusCode: null,
      error: error.name === 'AbortError' ? 'Request timed out' : (error.message || "Network error"),
    };
  }
  */
}
