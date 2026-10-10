/**
 * @fileoverview Manages Toast notifications for UI feedback.
 */

class ToastController {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  /**
   * Displays a toast notification.
   * @param {string} message - The message to display.
   * @param {'success'|'error'|'info'} type - The type of toast.
   * @param {number} duration - Duration in milliseconds before dismissing.
   */
  show(message, type = 'info', duration = 4000) {
    if (!this.container) return;

    const toast = document.createElement('div');
    toast.className = `bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden flex toast-enter min-w-[300px] max-w-sm w-full`;

    // Icon and Color based on type
    let iconSvg = '';
    let iconColor = '';

    if (type === 'error') {
      iconColor = 'text-rose-500';
      iconSvg = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>`;
    } else if (type === 'success') {
      iconColor = 'text-green-500';
      iconSvg = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>`;
    } else {
      iconColor = 'text-brand';
      iconSvg = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>`;
    }

    toast.innerHTML = `
      <div class="p-4 flex items-start">
        <div class="flex-shrink-0">
          <svg class="h-6 w-6 ${iconColor}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            ${iconSvg}
          </svg>
        </div>
        <div class="ml-3 flex-1 pt-0.5 min-w-0">
          <p class="text-sm font-medium text-slate-900 break-words">${type.charAt(0).toUpperCase() + type.slice(1)}</p>
          <p class="mt-1 text-sm text-slate-500 break-words">${message}</p>
        </div>
        <div class="ml-4 flex-shrink-0 flex">
          <button class="bg-white rounded-md inline-flex text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand">
            <span class="sr-only">Close</span>
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    `;

    this.container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.classList.remove('toast-enter');
      toast.classList.add('toast-enter-active');
    });

    const removeToast = () => {
      toast.classList.remove('toast-enter-active');
      toast.classList.add('toast-exit-active');
      setTimeout(() => toast.remove(), 300); // Wait for transition
    };

    // Close button event
    const closeBtn = toast.querySelector('button');
    closeBtn.addEventListener('click', removeToast);

    // Auto remove
    if (duration > 0) {
      setTimeout(removeToast, duration);
    }
  }
}

const toast = new ToastController('toast-container');
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ToastController, toast };
} else if (typeof window !== 'undefined') {
  window.toast = toast; // Attach to window for modules
}
