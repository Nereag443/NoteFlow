import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";
import { useColorScheme } from "react-native";
import { useNoteStore } from "@/store/notesStore";

export const color = {
  primary: {
    50:  "#e8eaf6",
    100: "#c5cae9",
    300: "#7986cb",
    500: "#3f51b5",
    700: "#283593",
    900: "#1a237e",
  },
  neutral: {
    0:   "#ffffff",
    50:  "#faf8f5",
    100: "#f2ede6",
    200: "#e0d5c8",
    400: "#b5a898",
    600: "#6b5f52",
    900: "#2c2420",
  },
  semantic: {
    success: "#40c057",
    warning: "#fab005",
    error:   "#fa5252",
    info:    "#228be6",
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
    textMuted: color.neutral[400],
    border: color.neutral[200],
    primary: color.primary[500],
    },
};

export const darkTheme = {
    ...MD3DarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
    background: color.neutral[900],
    text: color.neutral[50],
    surface: color.neutral[600],
    textMuted: color.neutral[400],
    border: color.neutral[600],
    primary: color.primary[300],
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