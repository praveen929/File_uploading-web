/**
 * Modern theme configuration for the application
 */

export const theme = {
  // Color palette
  colors: {
    primary: {
      50: '#e6f7ff',
      100: '#bae7ff',
      200: '#91d5ff',
      300: '#69c0ff',
      400: '#40a9ff',
      500: '#1890ff', // Main primary color
      600: '#096dd9',
      700: '#0050b3',
      800: '#003a8c',
      900: '#002766',
    },
    secondary: {
      50: '#f0f5ff',
      100: '#d6e4ff',
      200: '#adc6ff',
      300: '#85a5ff',
      400: '#597ef7',
      500: '#2f54eb', // Main secondary color
      600: '#1d39c4',
      700: '#10239e',
      800: '#061178',
      900: '#030852',
    },
    success: {
      50: '#f6ffed',
      100: '#d9f7be',
      200: '#b7eb8f',
      300: '#95de64',
      400: '#73d13d',
      500: '#52c41a', // Main success color
      600: '#389e0d',
      700: '#237804',
      800: '#135200',
      900: '#092b00',
    },
    warning: {
      50: '#fffbe6',
      100: '#fff1b8',
      200: '#ffe58f',
      300: '#ffd666',
      400: '#ffc53d',
      500: '#faad14', // Main warning color
      600: '#d48806',
      700: '#ad6800',
      800: '#874d00',
      900: '#613400',
    },
    error: {
      50: '#fff1f0',
      100: '#ffccc7',
      200: '#ffa39e',
      300: '#ff7875',
      400: '#ff4d4f',
      500: '#f5222d', // Main error color
      600: '#cf1322',
      700: '#a8071a',
      800: '#820014',
      900: '#5c0011',
    },
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e8e8e8',
      300: '#d9d9d9',
      400: '#bfbfbf',
      500: '#8c8c8c',
      600: '#595959',
      700: '#434343',
      800: '#262626',
      900: '#141414',
    },
    white: '#ffffff',
    black: '#000000',
    transparent: 'transparent',
  },

  // Typography
  typography: {
    fontFamily: {
      sans: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      serif: 'Georgia, Cambria, "Times New Roman", Times, serif',
      mono: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
    fontWeight: {
      thin: 100,
      extralight: 200,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
    fontSize: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
      '6xl': '4rem',     // 64px
    },
    lineHeight: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },

  // Spacing
  spacing: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    32: '8rem',
    40: '10rem',
    48: '12rem',
    56: '14rem',
    64: '16rem',
  },

  // Borders
  borders: {
    radius: {
      none: '0',
      sm: '0.125rem',
      default: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      '3xl': '1.5rem',
      full: '9999px',
    },
    width: {
      none: '0',
      thin: '1px',
      thick: '2px',
      thicker: '4px',
    },
  },

  // Shadows
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    default: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  },

  // Z-index
  zIndex: {
    auto: 'auto',
    0: '0',
    10: '10',
    20: '20',
    30: '30',
    40: '40',
    50: '50',
    dropdown: '1000',
    sticky: '1100',
    fixed: '1200',
    modal: '1300',
    popover: '1400',
    tooltip: '1500',
  },

  // Transitions
  transitions: {
    duration: {
      75: '75ms',
      100: '100ms',
      150: '150ms',
      200: '200ms',
      300: '300ms',
      500: '500ms',
      700: '700ms',
      1000: '1000ms',
    },
    timing: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
};

// CSS class utilities based on the theme
export const classes = {
  // Button styles
  button: {
    base: "font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2",
    primary: `bg-[${theme.colors.primary[500]}] hover:bg-[${theme.colors.primary[600]}] text-white focus:ring-[${theme.colors.primary[500]}]`,
    secondary: `bg-[${theme.colors.secondary[500]}] hover:bg-[${theme.colors.secondary[600]}] text-white focus:ring-[${theme.colors.secondary[500]}]`,
    success: `bg-[${theme.colors.success[500]}] hover:bg-[${theme.colors.success[600]}] text-white focus:ring-[${theme.colors.success[500]}]`,
    warning: `bg-[${theme.colors.warning[500]}] hover:bg-[${theme.colors.warning[600]}] text-white focus:ring-[${theme.colors.warning[500]}]`,
    error: `bg-[${theme.colors.error[500]}] hover:bg-[${theme.colors.error[600]}] text-white focus:ring-[${theme.colors.error[500]}]`,
    outline: "bg-transparent border hover:bg-gray-50",
    ghost: "bg-transparent hover:bg-gray-50",
    link: "bg-transparent underline hover:no-underline p-0",
    sizes: {
      xs: "px-2.5 py-1.5 text-xs",
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-5 py-2.5 text-lg",
      xl: "px-6 py-3 text-xl",
    },
    disabled: "opacity-50 cursor-not-allowed",
    withIcon: "inline-flex items-center",
  },

  // Card styles
  card: {
    base: "bg-white rounded-lg overflow-hidden",
    flat: "border border-gray-200",
    raised: "shadow-md hover:shadow-lg transition-shadow duration-300",
    interactive: "transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg",
  },

  // Input styles
  input: {
    base: "block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500",
    sizes: {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2",
      lg: "px-4 py-2.5 text-lg",
    },
    states: {
      error: "border-red-500 focus:border-red-500 focus:ring-red-500",
      success: "border-green-500 focus:border-green-500 focus:ring-green-500",
      disabled: "bg-gray-100 cursor-not-allowed",
    },
  },

  // Typography
  text: {
    heading1: "text-4xl font-bold",
    heading2: "text-3xl font-bold",
    heading3: "text-2xl font-bold",
    heading4: "text-xl font-bold",
    heading5: "text-lg font-bold",
    heading6: "text-base font-bold",
    paragraph: "text-base",
    small: "text-sm",
    tiny: "text-xs",
  },

  // Layout
  layout: {
    container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
    section: "py-12",
    grid: "grid gap-6",
    flexRow: "flex flex-row",
    flexCol: "flex flex-col",
    flexCenter: "flex items-center justify-center",
    flexBetween: "flex items-center justify-between",
  },

  // Navigation
  nav: {
    base: "bg-white shadow",
    container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
    link: "text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium",
    linkActive: "text-gray-900 px-3 py-2 rounded-md text-sm font-medium",
    mobileMenu: "sm:hidden",
    desktopMenu: "hidden sm:ml-6 sm:flex sm:space-x-8",
  },
};

export default theme;
