import React from "react";
// import "./styles.css";
// import "./react_styles.css";
// import NotFoundImage from "../../assets/notfound.jpeg";
// import Card from "./print_card";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import PrintCard from "./PrintCard";
import { breakArrayIntoGroups } from "../../utils";

export default function Print({ store }) {
  // const [saleType, setSaleType] = React.useState("mayor");
  // const [ocultar, setOcultar] = React.useState(false);

  const [groups, setGroups] = React.useState([]);

  React.useEffect(() => {
    if (store.length) {
      // console.log(store[0].articulos);
      setGroups(breakArrayIntoGroups(store, 6));
    }
  }, [store]);

  return (
    <>
      {groups.map((cardGroup, i) => {
        console.log(cardGroup);
        return (
          <Grid container sx={{ pageBreakAfter: "always" }}>
            {/* {cardGroup} */}
          </Grid>
        );
      })}
    </>
  );
}
