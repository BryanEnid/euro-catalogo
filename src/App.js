import React from "react";
import "./styles.css";
import db from "./db.json";

const secciones = db;

const styles = {
  app: {
    fontFamily: "ReadexPro",
    // fontWeight: 00,
    maxWidth: 720,
    margin: "0 auto",
  },
  prints: {
    background: "linear-gradient(180deg, rgba(11,17,24,1) 0%, #093793 100%)",
  },
  tituloCover: {
    position: "absolute",
    color: "white",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    width: "100%",
    textAlign: "center",
    fontSize: 40,
  },
  tituloSeccion: {
    marginTop: 30,
    backgroundColor: "#2C60DE",
    fontSize: 20,
    color: "white",
    padding: 10,
    margin: "30px 10px 30px 10px",
    borderRadius: 10,
    textTransform: "uppercase",
  },
  carta: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: "10px 10px 10px 20px",
  },
  contenedorCartas: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gridGap: "10px",
  },
  cartaHeader: {
    display: "flex",
    justifyContent: "space-evenly",
  },
  image: {
    borderRadius: 100,
    width: 190,
    height: 190,
    objectFit: "cover",
  },
  codigoContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  codigo: {
    fontSize: 25,
    width: "100%",
    backgroundColor: "#2C60DE",
    margin: "3px 0 0 0",
    padding: "2px 8px",
    borderRadius: 3,
    color: "white",
    textAlign: "center",
    textTransform: "uppercase",
  },
  articuloTitulo: {
    textTransform: "uppercase",
    fontSize: 25,
    margin: "5px 0",
    color: "#2C60DE",
  },
  articuloPrecio: {
    fontSize: 20,
    color: "#2C9735",
  },
  precio: {
    backgroundColor: "#2C9736",
    padding: "2px 30px 2px 9px",
    borderRadius: 20,
    color: "white",
  },
  agotado: {
    textAlign: "center",
    border: "3px solid red",
    color: "red",
    borderRadius: 20,
    transform: "rotate(-25deg)",
    background: "white",
    opacity: 0.7,

    position: "absolute",
    left: -30,
    width: "150px",
  },
};

function App({ store }) {
  const [value, setValue] = store;
  const { saleType } = value;

  return (
    <div style={styles.app}>
      {/* PORTADA */}
      <div style={{ position: "relative" }}>
        <img
          src={"./assets/cover.png"}
          alt="cover.png"
          style={{ width: "100%" }}
        />
        <div style={styles.tituloCover}>
          <div>Catalogo de productos</div>
          {saleType === "mayor" && (
            <div style={{ fontSize: 50, color: "#1BD934" }}>Al por mayor</div>
          )}
        </div>
      </div>

      <div
        id="print"
        style={{
          background: "transparent",
          padding: "0px 20px 20px 20px",
          ...styles.prints,
        }}
      >
        {secciones.map((seccion, i) => (
          <>
            {/* Barra con titulo */}
            <div style={styles.tituloSeccion} key={i + "titulo"}>
              {seccion.nombre}
            </div>

            <div style={styles.contenedorCartas} key={i + "cartas"}>
              {seccion.articulos.map((articulo) => (
                <Card articulo={articulo} store={store} />
              ))}
            </div>
          </>
        ))}
      </div>
    </div>
  );
}

let i = 0;

const Card = ({ articulo, store }) => {
  const [value, setValue] = store;
  const { saleType } = value;

  React.useEffect(() => {
    setInterval(() => {
      setValue({ saleType: i ? "detalle" : "mayor" });
      i ? i-- : i++;
    }, 2000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const codigos = articulo.codigos;

  return (
    <div style={styles.carta}>
      <div style={styles.cartaHeader}>
        <div style={{ position: "relative" }}>
          <div style={styles.agotado}> Agotado </div>
          <img
            src={`./assets/${articulo.imagen}`}
            style={styles.image}
            alt={articulo.imagen}
          />
        </div>

        {!!codigos.length && (
          <div style={styles.codigoContainer}>
            {codigos?.map((item, index) => {
              const color = ["#2C9FDE", "#2C60DE", "#662CDE"][index];
              const [codigo, nombre] = item.split(";");
              return (
                <>
                  <div
                    style={{ ...styles.codigo, ...{ backgroundColor: color } }}
                  >
                    {nombre}
                  </div>
                  <div
                    style={{ ...styles.codigo, ...{ backgroundColor: color } }}
                  >
                    {codigo}
                  </div>
                </>
              );
            })}
            <div
              style={{
                ...styles.codigo,
                ...{ fontSize: styles.codigo.fontSize / 2 },
              }}
            >
              codigo
            </div>
          </div>
        )}
      </div>
      <div style={styles.articuloTitulo}>{articulo.titulo}</div>
      <div
        style={{
          ...styles.articuloPrecio,
          ...(saleType === "detalle" && { color: "#2C60DE" }),
        }}
      >
        <span> PRECIO </span>
        <span
          style={{
            ...styles.precio,
            ...(saleType === "detalle" && { backgroundColor: "#2C60DE" }),
          }}
        >
          ${articulo.precio[saleType]}
        </span>
      </div>
    </div>
  );
};

export default App;
