/**
 * Apple SwiftUI Taptic Engine Haptic Feedback Simulator
 * Triggers crisp micro-vibrations for web interactions on supported devices.
 */
export const triggerHaptic = (style = 'light') => {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try {
      switch (style) {
        case 'light':
          navigator.vibrate(8);
          break;
        case 'medium':
          navigator.vibrate(18);
          break;
        case 'success':
          navigator.vibrate([10, 30, 15]);
          break;
        case 'warning':
        case 'error':
          navigator.vibrate([25, 40, 25]);
          break;
        default:
          navigator.vibrate(10);
      }
    } catch (e) {
      // Gracefully ignore browsers that restrict vibration permissions
    }
  }
};

export default triggerHaptic;
