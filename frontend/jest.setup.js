// import '@testing-library/jest-dom/extend-expect';
import '@testing-library/jest-dom';

window.matchMedia = window.matchMedia || function() {
    return {
        matches: false,
        addListener: function() {},
        removeListener: function() {}
    };
};

class ResizeObserver {
    constructor(callback) {
      this.callback = callback;
    }
  
    observe() {
      // Mock observe method
    }
  
    unobserve() {
      // Mock unobserve method
    }
  
    disconnect() {
      // Mock disconnect method
    }
}

global.ResizeObserver = ResizeObserver;
