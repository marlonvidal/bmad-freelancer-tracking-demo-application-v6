/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        'card-padding': '20px',
        'column-padding': '24px',
      },
      fontSize: {
        'card-title': '16px',
        'body': '14px',
        'timer-button': '36px',
      },
      colors: {
        'semantic': {
          'success': '#10b981',    // billable - green
          'muted': '#6b7280',      // non-billable - gray
          'accent': '#3b82f6',     // active timer - blue
          'warning': '#f59e0b',    // overdue - amber
        }
      }
    },
  },
  plugins: [],
}
