import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

export default function Card({ articulo, saleType, seccion }) {
  // const codigos = articulo.codigos;

  // const [image, setImage] = React.useState("");
  // const [noImage, setNoImage] = React.useState(false);

  // const tester = new Image();
  // tester.src = `./assets/${seccion}/${articulo.imagen}`;
  // tester.onload = () => setImage(`./assets/${seccion}/${articulo.imagen}`);
  // tester.onerror = (e) => {
  //   setNoImage(true);
  //   setImage(NotFoundImage);
  // };

  return (
    <Grid item xs={4}>
      <Box
        sx={{
          border: "1px solid black",
          background: "red",
        }}
      >
        hola
      </Box>
    </Grid>
  );
}
