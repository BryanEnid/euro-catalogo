import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { Typography, Divider } from "@mui/material";
import NotFoundImage from "../../assets/notfound.jpeg";
import { numberWithCommas } from "../../utils";
import { theme } from "../../theme";

export default function Card({ data, sx, seccion, salesType, pdfType }) {
  const [image, setImage] = React.useState(
    `./assets/${seccion}/${data.imagen}`
  );
  const [, setNoImage] = React.useState(false);

  const handleImageError = (e) => {
    setNoImage(true);
    setImage(NotFoundImage);
  };

  const SalesTypeText = ({ salesType, suppress }) => {
    let text = Object({
      mayor: "Al por mayor",
      detalle: "Al detalle",
    })[salesType];

    if (suppress) text = "Precio";

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
            position: "relative",
          }}
        >
          ${numberWithCommas(data.precio[salesType])}
          <Typography
            component="span"
            sx={{ fontSize: theme.typography.body1.fontSize / 1.5 }}
          >
            .00
          </Typography>
        </Typography>
        {/*  */}
        {data?.oferta && data.precioPrevio[salesType] && (
          <div style={{ position: "relative", display: "inline" }}>
            <Typography
              component="span"
              sx={{
                // background: theme.palette[color].main,
                px: 1,
                borderRadius: 3,
                color: "#999",
                fontWeight: 400,
                textDecoration: "line-through",
              }}
            >
              ${numberWithCommas(data.precioPrevio[salesType])}
              <Typography
                component="span"
                sx={{ fontSize: theme.typography.body1.fontSize / 1.5 }}
              >
                .00
              </Typography>
            </Typography>

            <Typography
              component="span"
              sx={{
                fontSize: theme.typography.body1.fontSize / 1.5,
                position: "absolute",
                color: "#999",
                left: "50%",
                transform: "translate(-50%,-50%)",
              }}
            >
              antes
            </Typography>
          </div>
        )}
        {/* <Typography
            component="span"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              fontSize: theme.typography.body1.fontSize / 1.5,
            }}
          >
            antes
          </Typography> */}
      </Typography>
    );
  };

  return (
    <Grid
      item
      xs={12}
      sx={{
        background: "white",
        borderRadius: "30px",
        display: "flex",
        flexDirection: "column",

        px: 3,
        py: 1,
        // WebkitFilter: pdfType === "mobile" && "drop-shadow(0px 0px 20px #333)",
        ...(pdfType === "print" && { border: "1px solid #999" }),
        zIndex: 1,
        ...sx,
        ...(data.suppress && { opacity: 0 }),
      }}
    >
      {(data?.oferta || data?.agotado) && <Box sx={{ height: 20 }} />}
      <Grid container direction="row" sx={{ flexGrow: 4 }}>
        <Box
          justifyContent="center"
          alignItems="center"
          sx={{ flex: 5, display: "flex", position: "relative" }}
        >
          {data.agotado && (
            <Box
              sx={{
                border: "3px solid red",
                borderRadius: 10,
                padding: 0.5,
                width: 140,
                background: "white",
                position: "absolute",
                top: 0,
                left: 0,
                transform: "translate(-25px, 5px) rotate(-20deg) ",
              }}
            >
              <center>
                <Typography variant="caption" fontWeight={700} color="red">
                  Agotado
                </Typography>
              </center>
            </Box>
          )}
          {data?.oferta && data?.precioPrevio?.[salesType] && (
            <Box
              sx={{
                position: "absolute",
                border: "3px solid #00bb00",
                borderRadius: 10,
                padding: 0.5,
                width: 110,
                background: "white",
                bottom: 0,
                right: 0,
                transform: "translate(25px, -15px) rotate(-20deg) ",
              }}
            >
              <center>
                <Typography variant="caption" fontWeight={700} color="#00bb00">
                  Oferta
                </Typography>
              </center>
            </Box>
          )}
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
                key={`${nombre}-${codigo}`}
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
          {salesType === "mayor" && (
            <SalesTypeText salesType="mayor" suppress />
          )}
          {salesType === "detalle" && (
            <SalesTypeText salesType="detalle" suppress />
          )}
          {salesType === "todos" && (
            <>
              <SalesTypeText salesType="mayor" />
              <SalesTypeText salesType="detalle" />
            </>
          )}
        </Box>
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <Box>
          <Typography
            variant="caption"
            fontSize={13}
            fontWeight={700}
            color="primary.dark"
          >
            {data.footer}
          </Typography>
        </Box>
      </Box>
    </Grid>
  );
}
