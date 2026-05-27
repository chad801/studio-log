import { TextStyle } from "react-native";

export const colors = {
  canvas: "#f6f7f4",
  panel: "#ffffff",
  ink: "#25272a",
  muted: "#666b73",
  quiet: "#8b929b",
  line: "#dcdfe3",
  teal: "#0f766e",
  tealDeep: "#0b5651",
  tealSoft: "#dcefed",
  clay: "#b85c38",
  claySoft: "#f2dfd7",
  sage: "#7b8f52",
  sageDeep: "#536236",
  sageSoft: "#e4ead9",
  amber: "#bc7a18",
  amberSoft: "#f4e4c8",
  plum: "#5b3f8c",
  plumSoft: "#e6ddf6",
  danger: "#b42318",
  dangerSoft: "#f7dedb"
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32
};

export const radius = {
  sm: 8,
  md: 10,
  lg: 14
};

export const typography = {
  eyebrow: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0,
    textTransform: "uppercase"
  } satisfies TextStyle,
  screenTitle: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 0
  } satisfies TextStyle,
  title: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 0
  } satisfies TextStyle,
  cardTitle: {
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0
  } satisfies TextStyle,
  body: {
    fontSize: 15,
    lineHeight: 21
  } satisfies TextStyle,
  caption: {
    fontSize: 13,
    lineHeight: 18
  } satisfies TextStyle,
  badge: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0,
    textTransform: "uppercase"
  } satisfies TextStyle
};
