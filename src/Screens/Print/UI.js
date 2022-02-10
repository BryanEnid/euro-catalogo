import React from "react";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import PrintIcon from "@mui/icons-material/Print";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
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
      }}
    >
      <Grid item>
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
          <Button value="justify" aria-label="justified" onClick={window.print}>
            <PrintIcon />
          </Button>
        </ToggleButtonGroup>
      </Grid>
    </Grid>
  );
}
