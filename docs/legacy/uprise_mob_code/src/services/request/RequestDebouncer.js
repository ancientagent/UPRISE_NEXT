/**
 * Request Debouncer - Prevents duplicate API calls
 * Helps avoid "hall of mirrors" effects from rapid-fire requests
 */

class RequestDebouncer {
  constructor(options = {}) {
    this.defaultDelay = options.defaultDelay || 500; // 500ms default
    this.maxDelay = options.maxDelay || 5000; // 5 second max
    this.pendingRequests = new Map();
  }

  /**
   * Debounce a request by URL and method
   * Returns a promise that resolves when the debounce period ends
   */
  debounce(url, method = 'GET', delay = this.defaultDelay) {
    const key = `${method}:${url}`;
    
    // If there's already a pending request for this URL/method, return that promise
    if (this.pendingRequests.has(key)) {
      console.log(`Debouncing duplicate request: ${key}`);
      return this.pendingRequests.get(key);
    }

    // Create a new debounced promise
    const promise = new Promise((resolve) => {
      setTimeout(() => {
        this.pendingRequests.delete(key);
        resolve();
      }, Math.min(delay, this.maxDelay));
    });

    this.pendingRequests.set(key, promise);
    return promise;
  }

  /**
   * Cancel all pending requests for a specific URL/method
   */
  cancel(url, method = 'GET') {
    const key = `${method}:${url}`;
    this.pendingRequests.delete(key);
  }

  /**
   * Cancel all pending requests
   */
  cancelAll() {
    this.pendingRequests.clear();
  }

  /**
   * Get current pending requests count
   */
  getPendingCount() {
    return this.pendingRequests.size;
  }

  /**
   * Check if a request is currently pending
   */
  isPending(url, method = 'GET') {
    const key = `${method}:${url}`;
    return this.pendingRequests.has(key);
  }
}

export default RequestDebouncer;


