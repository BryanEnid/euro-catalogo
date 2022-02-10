import React from "react";
import { breakArrayIntoGroups } from "../../utils";
import { Typography, Grid, Box } from "@mui/material";

import { theme } from "../../theme";
import Cover from "./Cover";
import Card from "./Card";
import UI from "./UI";

export default function Print({ store }) {
  const [salesType, setSalesType] = React.useState("todos");
  // const [ocultar, setOcultar] = React.useState(false);

  const [sections, setSections] = React.useState([]);

  React.useEffect(() => {
    if (store.length) {
      const data = store.map((item) => {
        const groups = breakArrayIntoGroups(item.articulos, 6);
        return {
          section: item.nombre,
          list: groups,
        };
      });

      setSections(data);
    }
  }, [store]);

  return (
    <>
      <UI value={salesType} setter={setSalesType} />

      <Cover salesType={salesType} />

      {sections.map((sectionGroup, i) =>
        sectionGroup.list.map((item) => {
          return (
            <Grid
              key={`${sectionGroup.section}-${i}-${item[0].id}`}
              container
              sx={{
                maxWidth: 720,
                pageBreakAfter: "always",
                height: "100vh",
                display: "flex",
                margin: "0 auto",
                py: 1,
              }}
              flexDirection="column"
            >
              {/* HEADER */}
              <Grid
                container
                sx={{ flex: 1, justifyContent: "center", alignItems: "center" }}
              >
                <Box
                  sx={{
                    background: theme.palette.primary.main,
                    width: "100%",
                    mx: 1,
                    mb: 1,
                    p: 1,
                    borderRadius: 3,
                  }}
                >
                  <Typography variant="body1" color="white">
                    {sectionGroup.section}
                  </Typography>
                </Box>
              </Grid>
              {/* ITEMS */}
              <Grid container sx={{ flex: 50 }}>
                <Grid
                  container
                  gap={1}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                  }}
                >
                  {item.map((data, i) => (
                    <Card
                      salesType={salesType}
                      data={data}
                      seccion={sectionGroup.section}
                      key={data.suppress ? data.id + i : data.id}
                    />
                  ))}
                </Grid>
              </Grid>
            </Grid>
          );
        })
      )}
    </>
  );
}
