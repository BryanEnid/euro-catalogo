import { createTheme } from "@mui/material/";

// Fonts
// import ReadexPro_ExtraLight from "./assets/ReadexPro-ExtraLight.ttf"; // 200
// import ReadexPro_Light from "./assets/ReadexPro-Light.ttf"; // 300
// import ReadexPro_Regular from "./assets/ReadexPro-Regular.ttf"; // 400
// import ReadexPro_Medium from "./assets/ReadexPro-Medium.ttf"; // 500
// import ReadexPro_SemiBold from "./assets/ReadexPro-SemiBold.ttf"; // 600
// import ReadexPro_Bold from "./assets/ReadexPro-Bold.ttf"; // 700

export const theme = createTheme({
  typography: {
    fontFamily: "ReadexPro",

    allVariants: {
      textTransform: "uppercase",
    },

    h1: {
      fontWeight: "600",
      fontSize: 45,
    },

    body1: {
      fontWeight: "600",
      fontSize: 18,
    },

    body2: {
      fontWeight: "600",
      fontSize: 18,
    },

    caption: {
      fontWeight: "400",
      fontSize: 15,
    },
  },

  palette: {
    primary: {
      // #8DC73C
      light: "#8fe066",
      main: "#8DC73C",
      dark: "#6d9731",
      contrastText: "#fff",
    },

    secondary: {
      light: "#3cdee4",
      main: "#32b8bd",
      dark: "#258a8d",
      contrastText: "#000",
    },
  },

  // MuiCssBaseline: {
  //   styleOverrides: {
  //     "@font-face": [
  //       {
  //         fontFamily: "ReadexPro",
  //         fontStyle: "regular",
  //         fontWeight: 400,
  //         src: `url(${ReadexPro_Regular})`,
  //       },
  //       {
  //         fontFamily: "ReadexPro",
  //         fontStyle: "medium",
  //         fontWeight: 500,
  //         src: `url(${ReadexPro_Medium})`,
  //       },
  //       {
  //         fontFamily: "ReadexPro",
  //         fontStyle: "semi bold",
  //         fontWeight: 600,
  //         src: `url(${ReadexPro_SemiBold})`,
  //       },
  //       {
  //         fontFamily: "ReadexPro",
  //         fontStyle: "bold",
  //         fontWeight: 700,
  //         src: `url(${ReadexPro_Bold})`,
  //       },
  //     ],
  //   },
  // },
});
