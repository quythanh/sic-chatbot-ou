interface Events {
  [key: string]: unknown[];
}
class EventEmitter<E extends Events> {
  private events: Partial<{ [K in keyof E]: Array<(...args: E[K]) => void> }> = {};

  on<K extends keyof E>(eventName: K, listener: (...args: E[K]) => void) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName]?.push(listener);
  }

  emit<K extends keyof E>(eventName: K, ...args: E[K]) {
    const listeners = this.events[eventName];
    if (listeners) {
      listeners.forEach(listener => {
        listener(...args);
      });
    }
  }

  off<K extends keyof E>(eventName: K, listener: (...args: E[K]) => void) {
    const listeners = this.events[eventName];
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    }
  }
}
export default EventEmitter