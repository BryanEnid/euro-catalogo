import React from "react";

import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import PrintIcon from "@mui/icons-material/Print";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";

export default function UI({ value, setter }) {
  const handleAlignment = (event, newAlignment) => {
    setter(newAlignment);
  };

  return (
    <Grid
      item
      xs={12}
      justifyContent="flex-start"
      sx={{
        "@media print": { display: "none" },
        padding: 1,
        position: "fixed",
        zIndex: 2,
      }}
    >
      <Stack direction="column" spacing={2}>
        <ToggleButtonGroup
          orientation="vertical"
          value={value}
          exclusive
          onChange={handleAlignment}
          aria-label="text alignment"
          size={"small"}
          color="primary"
          sx={{ background: "white" }}
        >
          <ToggleButton value="mayor" aria-label="left aligned">
            <AddIcon />
          </ToggleButton>
          <ToggleButton value="detalle" aria-label="centered">
            <RemoveIcon />
          </ToggleButton>
          <ToggleButton value="todos" aria-label="right aligned">
            <Typography>A</Typography>
          </ToggleButton>
        </ToggleButtonGroup>

        <ToggleButtonGroup
          orientation="vertical"
          exclusive
          aria-label="text alignment"
          size={"small"}
          color="primary"
          sx={{ background: "white" }}
        >
          <ToggleButton onClick={window.print}>
            <PrintIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>
    </Grid>
  );
}
