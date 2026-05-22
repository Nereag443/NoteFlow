import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";
import { useColorScheme } from "react-native";
import { useNoteStore } from "@/store/notesStore";

export const color = {
  primary: {
    50:  "#e8f1ff",
    100: "#cce0ff",
    300: "#7db8ff",
    500: "#4d7bdf",
    700: "#1a5fd4",
    900: "#0a3490",
  },
  neutral: {
    0:   "#ffffff",
    50:  "#f0f6ff",
    100: "#ddeeff",
    200: "#c0dbff",
    400: "#5b8fd6",
    600: "#3a6ab5",
    900: "#0f2250",
  },
  semantic: {
    success: "#40c057",
    warning: "#fab005",
    error:   "#fa5252",
    info:    "#228be6",
  },
  priority: {
    low: "#67abe7",
    medium: "#ffd65d",
    high: "#ff6b6b",
  }
} as const;

export const ideaColors = {
  rose: {
    light: "#FFCDD2",
    dark: "#7F1D1D",
  },
  pink: {
    light: "#F8BBD0",
    dark: "#831843",
  },
  purple: {
    light: "#E1BEE7",
    dark: "#581C87",
  },
  deepPurple: {
    light: "#D1C4E9",
    dark: "#4C1D95",
  },
  indigo: {
    light: "#C5CAE9",
    dark: "#312E81",
  },
  blue: {
    light: "#BBDEFB",
    dark: "#1E3A8A",
  },
  sky: {
    light: "#B3E5FC",
    dark: "#0C4A6E",
  },
  cyan: {
    light: "#B2EBF2",
    dark: "#155E75",
  },
  teal: {
    light: "#B2DFDB",
    dark: "#134E4A",
  },
  green: {
    light: "#C8E6C9",
    dark: "#14532D",
  },
} as const;

export const typography = {
    fontFamily : {
        regular: "System",
        medium: "System",
        semibold: "System",
        bold: "System",
        mono: "monospace",
    },
    fontSize : {
        xs: 11,
        sm: 13,
        md: 15,
        lg: 17,
        xl: 20,
        "2xl": 24,
        "3xl": 30,
        "4xl": 36,
        "5xl": 48,
        "6xl": 60,
    },
    fontWeight : {
        regular: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
    },
    lineHeight : {
        tight: 1.2,
        normal: 1.5,
        loose: 1.8,
    }
} as const;

export const spacing = {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    8: 32,
    10: 40,
    12: 48,
    16: 64,
    20: 80,
    24: 96,
} as const;

export const radius = {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
} as const;

export const lightTheme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
    background: color.neutral[50],
    text: color.neutral[900],
    surface: color.neutral[0],
    surfaceVariant: color.neutral[50],
    textMuted: color.neutral[400],
    border: color.neutral[200],
    primary: color.primary[500],
    elevation: "rgba(99,102,241,0.12)",
    },
};

export const darkTheme = {
    ...MD3DarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
    background: color.neutral[900],
    text: color.neutral[50],
    surface: color.neutral[900],
    surfaceVariant: color.neutral[600],
    textMuted: color.neutral[400],
    border: color.neutral[600],
    primary: color.primary[300],
    elevation: "rgba(255,255,255,0.08)",
    },
};

export const useAppTheme = () => {
    const themeMode = useNoteStore((state) => state.themeMode);
    const colorScheme = useColorScheme();
    const resolvedScheme = themeMode === "system" ? colorScheme : themeMode;
    return resolvedScheme === "dark" ? darkTheme : lightTheme;
};

export const useIsDarkMode = () => {
    const themeMode = useNoteStore((state) => state.themeMode);
    const colorScheme = useColorScheme();
    return themeMode === "system" ? colorScheme === "dark" : themeMode === "dark";
};
export type IdeaColorKey = keyof typeof ideaColors;
export const getIdeaColor = (colorKey?: string, isDark?: boolean) => {
  const fallback = isDark ? ideaColors.rose.dark : ideaColors.rose.light;
  if(!colorKey) {
    return fallback;
  }
  const key = colorKey as IdeaColorKey
  if(!ideaColors[key]) {
    return fallback;
  }
  return ideaColors[key][isDark ? "dark" : "light"];
}