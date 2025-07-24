import React, { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";

const ThemeToggle = ({ className = "" }) => {
  const { theme, setLightTheme, setDarkTheme, setSystemTheme, actualTheme } =
    useTheme();
  const [isOpen, setIsOpen] = useState(false);

  // Direct theme functions that work immediately
  const directSetLight = () => {
    const root = document.documentElement;
    root.classList.remove("dark", "light");
    root.classList.add("light");
    root.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
    setLightTheme(); // Also update context
    console.log("🌞 Direct light theme applied");
  };

  const directSetDark = () => {
    const root = document.documentElement;
    root.classList.remove("dark", "light");
    root.classList.add("dark");
    root.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
    setDarkTheme(); // Also update context
    console.log("🌙 Direct dark theme applied");
  };

  const directSetSystem = () => {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    const root = document.documentElement;
    root.classList.remove("dark", "light");
    root.classList.add(systemTheme);
    root.setAttribute("data-theme", systemTheme);
    localStorage.setItem("theme", "system");
    setSystemTheme(); // Also update context
    console.log("💻 Direct system theme applied:", systemTheme);
  };

  const themes = [
    {
      key: "light",
      label: "Light",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
      action: directSetLight,
    },
    {
      key: "dark",
      label: "Dark",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      ),
      action: directSetDark,
    },
    {
      key: "system",
      label: "System",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      action: directSetSystem,
    },
  ];

  const currentTheme = themes.find((t) => t.key === theme);

  return (
    <div className={`relative ${className} `}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-gray-900 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100   rounded-md transition-colors cursor-pointer"
        title={`Current theme: ${currentTheme?.label} (${actualTheme})`}
      >
        {currentTheme?.icon}
        <span className="text-sm font-medium hidden sm:block">
          {currentTheme?.label}
        </span>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-20">
            <div className="py-1">
              {themes.map((themeOption) => (
                <button
                  key={themeOption.key}
                  onClick={() => {
                    console.log("🎨 Theme button clicked:", themeOption.key);
                    themeOption.action();
                    setIsOpen(false);

                    // Force immediate DOM update
                    setTimeout(() => {
                      const root = document.documentElement;
                      console.log(
                        "DOM classes after theme change:",
                        root.classList.toString()
                      );
                    }, 100);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    theme === themeOption.key
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-200"
                  }`}
                >
                  {themeOption.icon}
                  <span>{themeOption.label}</span>
                  {theme === themeOption.key && (
                    <svg
                      className="w-4 h-4 ml-auto"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeToggle;
