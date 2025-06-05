
interface RequestConfig {
  url: string;
  options?: RequestInit;
  retries?: number;
  timeout?: number;
}

class RequestMiddleware {
  private static defaultTimeout = 10000; // 10 seconds
  private static defaultRetries = 3;

  static async execute({ url, options = {}, retries = this.defaultRetries, timeout = this.defaultTimeout }: RequestConfig): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const requestOptions: RequestInit = {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    let lastError: Error;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        console.log(`API Request (attempt ${attempt + 1}):`, { url, options: requestOptions });
        
        const response = await fetch(url, requestOptions);
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        console.log('API Response success:', { url, status: response.status });
        return response;
      } catch (error) {
        lastError = error as Error;
        console.error(`API Request failed (attempt ${attempt + 1}):`, { url, error: lastError.message });
        
        if (attempt === retries) {
          break;
        }
        
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }

    clearTimeout(timeoutId);
    throw new Error(`Request failed after ${retries + 1} attempts: ${lastError.message}`);
  }
}

export default RequestMiddleware;
