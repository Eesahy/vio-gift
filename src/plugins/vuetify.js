import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const vioTheme = {
  dark: false,
  colors: {
    background: "#faf7f0",
    surface: "#ffffff",
    primary: "#8f5aa8",
    "primary-darken-1": "#673a7f",
    secondary: "#d9b4e8",
    cream: "#faf7f0",
    error: "#e53e3e",
    success: "#22c55e",
    warning: "#f59e0b",
  },
};

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: "vioTheme",
    themes: { vioTheme },
  },
  defaults: {
    VBtn: {
      style: "font-family: 'Belleza', serif; letter-spacing: 0.02em;",
      rounded: "pill",
    },
    VTextField: {
      variant: "outlined",
      density: "comfortable",
      rounded: "lg",
    },
    VTextarea: {
      variant: "outlined",
      density: "comfortable",
      rounded: "lg",
    },
    VSelect: {
      variant: "outlined",
      density: "comfortable",
      rounded: "lg",
    },
  },
});
