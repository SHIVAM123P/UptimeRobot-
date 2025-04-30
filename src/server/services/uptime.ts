'use server';

/**
 * Represents the status result of a website check.
 */
export interface WebsiteCheckResult {
  /**
   * Indicates whether the website is currently considered up (true) or down (false).
   */
  isUp: boolean;
  /**
   * The HTTP status code returned when checking the website. Null if fetch failed.
   */
  statusCode: number | null;
  /**
    * Error message if the check failed.
    */
  error: string | null;
   /**
    * Duration of the check in milliseconds.
    */
   duration: number;
}


/**
 * Asynchronously checks the uptime status of a given URL using server-side fetch.
 *
 * @param url The URL to check.
 * @param timeout The maximum time in milliseconds to wait for the request. Defaults to 5000ms (5 seconds).
 * @returns A promise that resolves to a WebsiteCheckResult object.
 */
export async function checkWebsiteStatusReal(url: string, timeout: number = 5000): Promise<WebsiteCheckResult> {
  const startTime = Date.now();
  let duration: number;
  try {
    // Use HEAD request to minimize data transfer, if allowed. Fallback to GET if needed.
    // Set a timeout for the request.
    const response = await fetch(url, {
        method: 'HEAD', // Try HEAD first
        cache: 'no-store',
        redirect: 'follow', // Follow redirects
        signal: AbortSignal.timeout(timeout) // Apply timeout
      });

    duration = Date.now() - startTime;

    // Consider any 2xx or 3xx status as 'up' for basic monitoring
    const isUp = response.status >= 200 && response.status < 400;

    return {
      isUp: isUp,
      statusCode: response.status,
      error: !isUp ? `${response.status} ${response.statusText}` : null,
      duration: duration,
    };
  } catch (error: any) {
     duration = Date.now() - startTime;
    // console.error(`Fetch failed for ${url}:`, error);

    let errorMessage = "Network error or failed fetch";
    if (error.name === 'AbortError') {
      errorMessage = `Request timed out after ${timeout}ms`;
    } else if (error instanceof TypeError && error.message.includes('fetch failed')) {
       // This often indicates a DNS resolution error, network issue, or sometimes SSL/TLS problems.
       errorMessage = `Fetch failed (DNS, Network, or SSL issue?)`;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      isUp: false,
      statusCode: null,
      error: errorMessage,
      duration: duration,
    };
  }
}
