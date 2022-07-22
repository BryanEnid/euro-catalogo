import React from "react";
import { breakArrayIntoGroups } from "../../utils";
import { Typography, Grid, Box } from "@mui/material";
import { isArray } from "lodash";
import "./styles.css";

import { theme } from "../../theme";
import Cover from "./Cover";
import Card from "./Card";
import UI from "./UI";

const config = {
  salesType: localStorage.getItem("sales"),
  pdfType: localStorage.getItem("pdf"),
};

export default function Print({ store }) {
  const [salesType, setSalesType] = React.useState(config.salesType ?? "todos");
  const [pdfType, setPDFType] = React.useState(config.pdfType ?? "print");
  const [sections, setSections] = React.useState([]);

  React.useEffect(() => {
    if (store.length && pdfType === "print") {
      const data = store.map((item) => {
        const groups = breakArrayIntoGroups(item.articulos, 6);
        return {
          section: item.nombre,
          list: groups,
        };
      });
      setSections(data);
    } else if (store.length) {
      const data = store.map((item) => {
        return {
          section: item.nombre,
          list: item.articulos,
          id: item.id,
        };
      });
      setSections(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store]);

  const handleNewSections = (value, type) => {
    const setters = { sales: setSalesType, pdf: setPDFType };
    setters[type](value);

    if (type === "pdf") {
      if (store.length && value === "print") {
        const data = store.map((item) => {
          const groups = breakArrayIntoGroups(item.articulos, 6);
          return {
            section: item.nombre,
            list: groups,
          };
        });
        setSections(data);
      } else if (store.length) {
        const data = store.map((item) => {
          return {
            section: item.nombre,
            list: item.articulos,
            id: item.id,
          };
        });
        setSections(data);
      }
    }
  };

  if (sections.length) {
    return (
      <Box
        sx={{
          background:
            pdfType === "mobile" &&
            "linear-gradient(180deg, #000208 0%, #093793 100%)",
        }}
      >
        <UI
          values={{ print: salesType, pdf: pdfType }}
          onPDFTypeChange={handleNewSections}
        />

        <Cover salesType={salesType} pdfType={pdfType} />

        {pdfType === "print" && isArray(sections[0].list?.[0]) ? (
          <PrintVersion
            sections={sections}
            salesType={salesType}
            pdfType={pdfType}
          />
        ) : (
          pdfType === "mobile" &&
          !isArray(sections[0].list?.[0]) && (
            <MobileVersion
              sections={sections}
              salesType={salesType}
              pdfType={pdfType}
            />
          )
        )}
      </Box>
    );
  } else {
    return <></>;
  }
}

const PrintVersion = ({ sections, salesType, pdfType }) => {
  return sections.map((sectionGroup, i) =>
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
            px: 1,
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
                  pdfType={pdfType}
                />
              ))}
            </Grid>
          </Grid>
        </Grid>
      );
    })
  );
};

const MobileVersion = ({ sections, salesType, pdfType }) => {
  return sections?.map(
    (sectionGroup, i) => (
      <Grid
        key={sectionGroup.id}
        container
        sx={{
          maxWidth: 720,
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
            {/* eslint-disable-next-line array-callback-return */}
            {sectionGroup?.list?.map((data, i) => {
              if (!isArray(data)) {
                return (
                  <Card
                    salesType={salesType}
                    data={data}
                    seccion={sectionGroup.section}
                    key={data.suppress ? data.id + i : data.id}
                    pdfType={pdfType}
                  />
                );
              }
            })}
          </Grid>
        </Grid>
      </Grid>
    )
    // })
  );
};
