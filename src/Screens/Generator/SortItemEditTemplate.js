import React from "react";
import NotFoundImage from "../../assets/notfound.jpeg";

const styles = {
  image: {
    width: 100,
    height: 100,
    objectFit: "cover",
  },
  card: {
    background: "white",
    border: "1px solid grey",
    margin: "10px 0",
    padding: 0,
    borderRadius: "3px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    maxWidth: 900,
  },
};

const SortItemEditTeplate = ({ value }) => {
  const [image, setImage] = React.useState(
    `./assets/${value.seccion}/${value.imagen}`
  );
  const unmounted = React.useRef(false);

  React.useEffect(() => {
    const tester = new Image();
    tester.src = `./assets/${value.seccion}/${value.imagen}`;
    tester.onerror = () => !unmounted.current && setImage(NotFoundImage);

    return () => {
      unmounted.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <center>
      <div style={styles.card} key={value.id}>
        <img
          src={image}
          style={styles.image}
          alt={value.imagen}
          key={value.image}
        />
        <div style={{ margin: "0 10px" }}>
          <div>{value.titulo}</div>
          <div>
            Al por mayor: {value.precio.mayor} | Al detalle:{" "}
            {value.precio.detalle}
          </div>
        </div>
      </div>
    </center>
  );
};

export default SortItemEditTeplate;
