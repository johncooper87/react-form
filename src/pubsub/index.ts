type Callback = (...args: any[]) => void;

export class Publisher {

  private static callbackQueue = new Map<Callback, any[]>();
  
  private static invokeCallbackQueue() {
    const callbackQueue = Publisher.callbackQueue;
    Publisher.callbackQueue = new Map();
    for (const [callback, args] of callbackQueue.entries()) callback(...args);
  }

  private callbacks = new Map<Callback, boolean>();

  subscribe(callback: Callback, batch = false) {
    this.callbacks.set(callback, batch);
    return () => { this.callbacks.delete(callback); }
  }

  publish(...args: any[]) {
    for (const [callback, batch] of this.callbacks.entries()) {
      if (batch) {
        if (Publisher.callbackQueue.size === 0) setTimeout(Publisher.invokeCallbackQueue, 0);
        Publisher.callbackQueue.set(callback, args);
      }
      else callback(...args);
    }
  }

  get isEmpty() {
    return this.callbacks.size > 0;
  }
}