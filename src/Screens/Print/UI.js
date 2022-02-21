import React from "react";

import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import NoteOutlinedIcon from "@mui/icons-material/NoteOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";

export default function UI({ values, setters, onPDFTypeChange }) {
  const [hidden, setHidden] = React.useState(false);

  const handleOption = (value, type) => {
    // if (value !== null) setters[type](value);
    if (value !== null) handleSections(value, type);
  };

  const handleSections = (value, type) => {
    onPDFTypeChange(value, type);
  };

  const handlePDF = async (type) => {
    try {
      const response = await fetch("http://localhost:9000/generatePDF", {
        body: JSON.stringify({ type }),
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const blob = await response.blob();
      const file = URL.createObjectURL(blob);
      window.open(file);
    } catch (e) {
      console.error(e);
    }
  };

  if (hidden) return <></>;

  return (
    <Box
      sx={{ position: "fixed", zIndex: 2, "@media print": { display: "none" } }}
    >
      <Grid item xs={12} justifyContent="flex-start" sx={{ padding: 1 }}>
        <ToggleButtonGroup
          orientation="vertical"
          exclusive
          onChange={({ target }) => handlePDF(target.value)}
          size={"small"}
          color="primary"
          sx={{ background: "white" }}
        >
          <ToggleButton value="print">
            <PictureAsPdfIcon sx={{ pr: 1 }} /> Impresion
          </ToggleButton>

          <ToggleButton value="mobile">
            <PictureAsPdfIcon sx={{ pr: 1 }} /> Mobil
          </ToggleButton>
        </ToggleButtonGroup>
      </Grid>

      <Grid item xs={6} justifyContent="flex-start" sx={{ padding: 1 }}>
        <Stack direction="column" spacing={2}>
          <ToggleButtonGroup
            orientation="vertical"
            value={values.print}
            exclusive
            onChange={(e, i) => handleOption(i, "salesType")}
            size={"small"}
            color="primary"
            sx={{ background: "white" }}
          >
            <ToggleButton id="mayor" value="mayor" aria-label="left aligned">
              <AddIcon />
            </ToggleButton>
            <ToggleButton id="detalle" value="detalle" aria-label="centered">
              <RemoveIcon />
            </ToggleButton>
            <ToggleButton id="todos" value="todos" aria-label="right aligned">
              <Typography>A</Typography>
            </ToggleButton>
          </ToggleButtonGroup>

          <ToggleButtonGroup
            orientation="vertical"
            value={values.pdf}
            exclusive
            onChange={(e, i) => handleOption(i, "pdf")}
            size={"small"}
            color="primary"
            sx={{ background: "white" }}
          >
            <ToggleButton id="print" value="print" aria-label="centered">
              <NoteOutlinedIcon />
            </ToggleButton>

            <ToggleButton id="mobile" value="mobile" aria-label="centered">
              <PhoneAndroidIcon />
            </ToggleButton>
          </ToggleButtonGroup>

          <ToggleButtonGroup
            orientation="vertical"
            exclusive
            size={"small"}
            color="primary"
            sx={{ background: "white" }}
          >
            <ToggleButton id="visibility" onClick={() => setHidden(true)}>
              <VisibilityIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Grid>
    </Box>
  );
}
