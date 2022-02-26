import React from "react";

import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import Modal from "@mui/material/Modal";
import CircularProgress from "@mui/material/CircularProgress";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import NoteOutlinedIcon from "@mui/icons-material/NoteOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";

function isNumeric(str) {
  if (typeof str != "string") return false; // we only process strings!
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}

const config = { offset: localStorage.getItem("offset") };

export default function UI({ values, onPDFTypeChange }) {
  const [hidden, setHidden] = React.useState(false);
  const [offset, setOffset] = React.useState(config.offset ?? 400);
  const [filesReady, setFilesReady] = React.useState(null);

  const handleOption = (value, type) => {
    if (value !== null) handleSections(value, type);
  };

  const handleSections = (value, type) => {
    onPDFTypeChange(value, type);
    localStorage.setItem(type, value);
  };

  const handlePDF = async (type) => {
    setFilesReady(false);
    if (isNumeric(type) || type === "") {
      setOffset(Number(type));
      localStorage.setItem("offset", type);
      return;
    }
    if (type) {
      const sales = ["mayor", "detalle"];
      const config = { headers: { "Content-Type": "application/json" } };

      const promises = sales.map((sale) => {
        const url = new URL("http://localhost:9000/generatePDF");
        const params = new URLSearchParams({ type, offset, sale });
        url.search = new URLSearchParams(params).toString();
        return fetch(url, config);
      });

      let i = 0;
      try {
        for await (const response of promises) {
          const file = await response.blob();
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL, "__blank" + i);
          i++;
        }
      } catch (e) {
        console.error(e);
        setFilesReady(false);
      } finally {
        setFilesReady(true);
      }
    }
  };

  if (hidden) return <></>;

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          zIndex: 2,
          "@media print": { display: "none" },
          width: 130,
        }}
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
              <PictureAsPdfIcon sx={{ pr: 1 }} /> Movil
            </ToggleButton>

            <TextField
              label={<Typography variant="caption">Offset</Typography>}
              type="number"
              variant="outlined"
              defaultValue={Number(offset)}
              // value={Number(offset)}
            />
          </ToggleButtonGroup>
        </Grid>

        <Grid item xs={6} justifyContent="flex-start" sx={{ padding: 1 }}>
          <Stack direction="column" spacing={2}>
            <ToggleButtonGroup
              orientation="vertical"
              value={values.print}
              exclusive
              onChange={(e, i) => handleOption(i, "sales")}
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
      <Modal
        open={filesReady === false}
        // onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <center>
            <CircularProgress />
          </center>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Generando archivos PDF.
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Espera unos segundos...
          </Typography>
        </Box>
      </Modal>
    </>
  );
}
