// Formatting utilities for the application

// Global formatting functions
window.formatDate = function (date) {
  return new Date(date).toLocaleString();
};

window.formatTime = function (date) {
  return new Date(date).toLocaleTimeString();
};

window.escapeHtml = function (unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Initialize any global formatting when DOM is ready
$(document).ready(function () {
  console.log('Formatting utilities loaded');
});
