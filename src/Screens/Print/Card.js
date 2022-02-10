import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { Typography, Divider } from "@mui/material";
import NotFoundImage from "../../assets/notfound.jpeg";
import { numberWithCommas } from "../../utils";
import { theme } from "../../theme";

export default function Card({ data, sx, seccion, salesType = "todos" }) {
  const [image, setImage] = React.useState(
    `./assets/${seccion}/${data.imagen}`
  );
  const [noImage, setNoImage] = React.useState(false);

  const handleImageError = (e) => {
    setNoImage(true);
    setImage(NotFoundImage);
  };

  const SalesTypeText = ({ salesType }) => {
    const text = Object({
      mayor: "Al por mayor",
      detalle: "Al detalle",
    })[salesType];

    const color = Object({
      mayor: "primary",
      detalle: "secondary",
    })[salesType];

    return (
      <Typography variant="body1" color={color}>
        {text}:{" "}
        <Typography
          component="span"
          sx={{
            background: theme.palette[color].main,
            px: 2,
            borderRadius: 3,
            color: "white",
            fontWeight: 600,
          }}
        >
          ${numberWithCommas(data.precio.mayor)}
          <Typography
            component="span"
            sx={{ fontSize: theme.typography.body1.fontSize / 1.5 }}
          >
            .00
          </Typography>
        </Typography>
      </Typography>
    );
  };

  return (
    <Paper
      item
      xs={12}
      elevation={10}
      sx={{
        background: "white",
        borderRadius: "30px",
        display: "flex",
        flexDirection: "column",
        px: 3,
        py: 1,
        ...sx,
      }}
    >
      <Grid container direction="row" sx={{ flexGrow: 4 }}>
        <Box
          justifyContent="center"
          alignItems="center"
          sx={{ flex: 5, display: "flex" }}
        >
          <img
            src={image}
            onError={handleImageError}
            alt={image}
            style={{
              borderRadius: 100,
              width: 180,
              height: 180,
              objectFit: "cover",
            }}
          />
        </Box>
        <Box
          justifyContent="flex-start"
          flexDirection="column-reverse"
          sx={{
            flex: 2,
            display: "flex",
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              width: "100%",
              background: theme.palette.primary.main,
              borderRadius: 2,
            }}
          >
            <Typography variant="caption" color="white" sx={{ my: 1 }}>
              CODIGO
            </Typography>
          </Box>
          {data.codigos.map((item, index) => {
            const [codigo, nombre] = item.split(";");
            const blue = theme.palette.primary.light;
            const green = theme.palette.secondary.light;
            const color = [blue, "#4cc8d3", green][index];
            return (
              <Box
                sx={{
                  width: "100%",
                  background: color,
                  borderRadius: 2,
                  my: 0.5,
                }}
              >
                <Typography variant="body2" color="white">
                  {nombre}
                </Typography>
                {nombre && <Divider color="white" />}
                <Typography variant="body2" color="white">
                  {codigo}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Grid>

      <Box sx={{ flexGrow: 1 }}>
        <Box>
          <Typography variant="body1" color="primary.dark">
            {data.titulo}
          </Typography>
        </Box>

        <Box>
          {salesType === "mayor" && <SalesTypeText salesType="mayor" />}
          {salesType === "detalle" && <SalesTypeText salesType="detalle" />}
          {salesType === "todos" && (
            <>
              <SalesTypeText salesType="mayor" />
              <SalesTypeText salesType="detalle" />
            </>
          )}
        </Box>
      </Box>
    </Paper>
  );
}
