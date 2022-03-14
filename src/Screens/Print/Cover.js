import React from "react";
import { Grid, Box, Typography } from "@mui/material/";
const CoverImage = "/assets/cover.png"

export default function Cover({ salesType, pdfType }) {
  const text = Object({
    mayor: "Al por mayor",
    detalle: "Al detalle",
    todos: "",
  })[salesType];

  return (
    <Grid
      item
      xs={12}
      sx={{
        ...(pdfType === "print" && { pageBreakAfter: "always" }),
        maxWidth: 720,
        maxHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 0,
        m: 0,
        overflow: "hidden",
      }}
    >
      <img
        src={CoverImage}
        alt={CoverImage}
        style={{ maxWidth: "100%", maxHeight: "100%", margin: 0, padding: 0 }}
      />

      <Box
        sx={{
          position: "absolute",
          color: "white",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: "100%",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: 40,
        }}
      >
        <Typography variant="h1">Cat&#193;logo de productos</Typography>
        <Typography variant="h1" color="secondary.dark">
          {text}
        </Typography>
      </Box>
    </Grid>
  );
}
