/**
 * Shared styles for the application
 * These styles can be imported and used across components
 */

// Button styles
export const buttonStyles = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition duration-300 shadow-md hover:shadow-lg",
  secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-6 py-2 rounded-lg transition duration-300 shadow-md hover:shadow-lg",
  success: "bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-lg transition duration-300 shadow-md hover:shadow-lg",
  danger: "bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2 rounded-lg transition duration-300 shadow-md hover:shadow-lg",
  warning: "bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-6 py-2 rounded-lg transition duration-300 shadow-md hover:shadow-lg",
  small: "px-4 py-1 text-sm",
  large: "px-8 py-3 text-lg",
  icon: "flex items-center justify-center gap-2",
  disabled: "opacity-50 cursor-not-allowed",
  link: "text-blue-600 hover:text-blue-800 underline font-medium",
};

// Card styles
export const cardStyles = {
  default: "bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6",
  bordered: "bg-white rounded-lg border border-gray-200 p-6",
  elevated: "bg-white rounded-lg shadow-xl p-6",
  interactive: "bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6",
  colored: "bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-md p-6",
};

// Input styles
export const inputStyles = {
  default: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200",
  error: "w-full px-4 py-2 border border-red-500 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition duration-200",
  success: "w-full px-4 py-2 border border-green-500 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition duration-200",
  withIcon: "pl-10", // Add this class to input when it has an icon
};

// Layout styles
export const layoutStyles = {
  container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  section: "py-12",
  flexCenter: "flex items-center justify-center",
  flexBetween: "flex items-center justify-between",
  flexColumn: "flex flex-col",
  grid2: "grid grid-cols-1 md:grid-cols-2 gap-6",
  grid3: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
  grid4: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
};

// Typography styles
export const typographyStyles = {
  heading1: "text-4xl font-bold text-gray-900",
  heading2: "text-3xl font-bold text-gray-900",
  heading3: "text-2xl font-bold text-gray-900",
  heading4: "text-xl font-bold text-gray-900",
  subtitle: "text-xl text-gray-600",
  body: "text-base text-gray-700",
  small: "text-sm text-gray-500",
  link: "text-blue-600 hover:text-blue-800 underline",
};

// Animation classes
export const animations = {
  fadeIn: "animate-fadeIn",
  slideIn: "animate-slideIn",
  pulse: "animate-pulse",
  bounce: "animate-bounce",
  spin: "animate-spin",
};

// Custom styles for specific components
export const customStyles = {
  navbar: "bg-white shadow-md py-4 sticky top-0 z-50",
  footer: "bg-gray-800 text-white py-12",
  sidebar: "bg-gray-100 p-4 h-full",
  badge: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
  avatar: "rounded-full object-cover",
  tooltip: "absolute bg-gray-900 text-white text-sm rounded py-1 px-2 -mt-8",
  modal: "fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50",
  modalContent: "bg-white rounded-lg shadow-xl p-6 max-w-md mx-auto",
};

// Table styles
export const tableStyles = {
  table: "min-w-full divide-y divide-gray-200",
  thead: "bg-gray-50",
  th: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
  tbody: "bg-white divide-y divide-gray-200",
  tr: "hover:bg-gray-50",
  td: "px-6 py-4 whitespace-nowrap text-sm text-gray-500",
  pagination: "flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6",
};

// Form styles
export const formStyles = {
  group: "mb-4",
  label: "block text-sm font-medium text-gray-700 mb-1",
  helpText: "mt-1 text-sm text-gray-500",
  errorText: "mt-1 text-sm text-red-600",
  checkbox: "h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded",
  radio: "h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300",
  select: "mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md",
};

// Alert styles
export const alertStyles = {
  info: "bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded",
  success: "bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded",
  warning: "bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded",
  error: "bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded",
};

// Combine all styles for easy import
export const styles = {
  button: buttonStyles,
  card: cardStyles,
  input: inputStyles,
  layout: layoutStyles,
  typography: typographyStyles,
  animations,
  custom: customStyles,
  table: tableStyles,
  form: formStyles,
  alert: alertStyles,
};

export default styles;
