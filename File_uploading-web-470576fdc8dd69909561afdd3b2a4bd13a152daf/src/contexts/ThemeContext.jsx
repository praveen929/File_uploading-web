import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Get theme from localStorage or default to 'light'
    const savedTheme = localStorage.getItem("theme");
    console.log("Initial theme from localStorage:", savedTheme);
    return savedTheme || "light";
  });

  const [actualTheme, setActualTheme] = useState("light");

  // Function to get system theme preference
  const getSystemTheme = () => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  // Update actual theme based on selected theme
  useEffect(() => {
    let newActualTheme;

    if (theme === "system") {
      newActualTheme = getSystemTheme();
    } else {
      newActualTheme = theme;
    }

    setActualTheme(newActualTheme);

    // Apply theme to document with force
    const root = document.documentElement;
    const body = document.body;

    // Force remove all theme classes first
    root.classList.remove("dark", "light");
    body.classList.remove("dark", "light");
    root.removeAttribute("data-theme");

    // Force apply new theme with multiple methods
    if (newActualTheme === "dark") {
      root.classList.add("dark");
      body.classList.add("dark");
      root.setAttribute("data-theme", "dark");

      // Force CSS recalculation
      document.body.style.display = "none";
      document.body.offsetHeight;
      document.body.style.display = "";

      // Trigger custom event for CSS updates
      window.dispatchEvent(new CustomEvent("themechange", { detail: "dark" }));

      console.log(
        "✅ Applied dark theme - Classes:",
        root.classList.toString(),
        "Data-theme:",
        root.getAttribute("data-theme")
      );
    } else {
      root.classList.add("light");
      body.classList.add("light");
      root.setAttribute("data-theme", "light");

      // Force CSS recalculation
      document.body.style.display = "none";
      document.body.offsetHeight;
      document.body.style.display = "";

      // Trigger custom event for CSS updates
      window.dispatchEvent(new CustomEvent("themechange", { detail: "light" }));

      console.log(
        "✅ Applied light theme - Classes:",
        root.classList.toString(),
        "Data-theme:",
        root.getAttribute("data-theme")
      );
    }

    // Save to localStorage
    localStorage.setItem("theme", theme);
    console.log("Theme saved:", theme, "Actual theme:", newActualTheme);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => {
        const newSystemTheme = getSystemTheme();
        setActualTheme(newSystemTheme);

        const root = document.documentElement;
        const body = document.body;

        // Force remove all theme classes first
        root.classList.remove("dark", "light");
        body.classList.remove("dark", "light");

        if (newSystemTheme === "dark") {
          root.classList.add("dark");
          body.classList.add("dark");
          root.setAttribute("data-theme", "dark");
        } else {
          root.classList.add("light");
          body.classList.add("light");
          root.setAttribute("data-theme", "light");
        }
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  const setLightTheme = () => {
    console.log("🌞 Setting light theme");
    setTheme("light");
  };

  const setDarkTheme = () => {
    console.log("🌙 Setting dark theme");
    setTheme("dark");
  };

  const setSystemTheme = () => {
    console.log("💻 Setting system theme");
    setTheme("system");
  };

  const toggleTheme = () => {
    console.log("🔄 Toggle theme called, current:", theme);
    if (theme === "light") {
      setDarkTheme();
    } else if (theme === "dark") {
      setSystemTheme();
    } else {
      setLightTheme();
    }
  };

  const value = {
    theme,
    actualTheme,
    setTheme,
    setLightTheme,
    setDarkTheme,
    setSystemTheme,
    toggleTheme,
    isDark: actualTheme === "dark",
    isLight: actualTheme === "light",
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
