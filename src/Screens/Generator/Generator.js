import React from "react";
import "./tables.css";
import uuid from "react-uuid";
import { download, checkImage } from "../../utils";
import _ from "lodash";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { arrayMoveImmutable as arrayMove } from "array-move";
import SortItemEditTeplate from "./SortItemEditTemplate";
import { CircularProgress } from "@mui/material";
import NotFoundImage from "../../assets/notfound.jpeg";

const styles = {
  seccion: {
    background: "white",
    margin: 10,
    borderRadius: 5,
    padding: 20,
  },
  icon: {
    position: "relative",
  },
  eliminarSeccion: {
    margin: "0 10px",
    background: "red",
    borderRadius: 4,
    color: "white",
    border: "1px solid red",
  },
  field: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    margin: "2px 0",
  },
};

const Search = ({ onChange = () => {} }) => {
  const [input, setInput] = React.useState("");
  const inputRef = React.useRef(null);

  return (
    <input
      style={{
        width: 300,
        border: "1px solid #999",
        borderRadius: 3,
        margin: 3,
        padding: 10,
      }}
      ref={inputRef}
      type="text"
      value={input}
      placeholder="Buscar"
      onChange={({ target }) => {
        setInput(target.value);
        onChange({
          value: target.value,
          setter: setInput,
          cb: onChange,
        });
      }}
    />
  );
};

const Generator = () => {
  const [search, setSearch] = React.useState({ value: "", setter: () => {} });
  const [sections, setSections] = React.useState(null);
  const [sectionName, setSectionName] = React.useState("");
  const [dragEnabled, setDragEnabled] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const fileRef = React.useRef();

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:9000/load");
        const data = await response.json();
        setSections(data);
      } catch (e) {
        const answer = window.confirm(
          "ERROR: " + e.message + "\nIntentar recargar nuevamente la pagina?"
        );
        if (answer) window.location.reload();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  React.useEffect(() => {
    if (sections) {
      handleSave(sections);
    }
  }, [sections]);

  const handleCreateSection = () => {
    if (sectionName) {
      const data = [{ nombre: sectionName, id: uuid() }, ...sections];
      const isEqual = _.isEqual(data, sections); // true
      if (!isEqual) {
        setSections(data);
        setSectionName("");
        handleSave(data);
      }
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    var reader = new FileReader();
    reader.onload = (e) => setSections(JSON.parse(e.target.result));
    reader.readAsText(file);
  };

  const handleSectionSubmit = (payload) => {
    const index = sections.findIndex((item) => item.id === payload.id);
    const data = [...sections];
    data[index] = { ...data[index], articulos: payload.articulos };
    const isEqual = _.isEqual(data, sections); // true
    if (!isEqual) {
      setSections(data);
      handleSave(data);
    }
  };

  const handleRename = (value, id) => {
    const index = sections.findIndex((item) => item.id === id);
    const data = [...sections];
    data[index] = { ...data[index], nombre: value };
    const isEqual = _.isEqual(data, sections); // true
    if (!isEqual) {
      setSections(data);
      handleSave(data);
    }
  };

  const handleSave = async (data) => {
    setLoading(true);
    return fetch("http://localhost:9000/save", {
      body: JSON.stringify(data),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  // TODO: add recover deleted section
  const handleRemoveSection = (datos) => {
    // TODO: Prompt confirmation
    const respuesta = window.confirm(
      `Estas seguro que deseas borrar la seccion (${datos?.nombre?.toUpperCase()}) completa?`
    );

    if (respuesta) {
      const confirmacion = window.confirm(
        `Estas seguro que deseas borrar esta seccion? (${datos?.nombre?.toUpperCase()})\n\nPresiona OK nuevamete para continuar`
      );
      if (confirmacion) {
        const index = sections.findIndex((item) => item.id === datos.id);
        const data = [...sections];
        if (index > -1) {
          data.splice(index, 1);
          setSections(data);
          handleSave(data);
        }
      }
    }
  };

  // Render "Upload File"
  if (!sections) {
    return (
      <>
        <input type="file" onChange={handleFileUpload} />
        <button onClick={() => setSections([])}>
          Generar nuevo spreadsheet
        </button>

        {loading && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10,
            }}
          >
            <CircularProgress color="primary" size={60} disableShrink />
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <div>
        <input
          style={{
            border: "1px solid #999",
            borderRadius: 3,
            padding: 10,
            margin: 3,
            width: 300,
          }}
          value={sectionName}
          onChange={(v) => setSectionName(v.target.value)}
          onKeyUp={({ key }) => key === "Enter" && handleCreateSection()}
          placeholder="Nombre de la seccion"
          type="text"
        />
        <button onClick={handleCreateSection}>Crear</button>
        <button onClick={() => fileRef.current.click()}>Importar</button>
        <input
          style={{ display: "none" }}
          onChange={handleFileUpload}
          type="file"
          ref={fileRef}
          accept="application/json"
        />
        <button onClick={() => download(sections)}>Exportar</button>
        {/* <button onClick={generatePDF}>Generar PDF</button> */}
        <button
          onClick={() => setDragEnabled(!dragEnabled)}
          style={{ color: !dragEnabled ? "black" : "red" }}
        >
          Ordenar {dragEnabled && "- ACTIVO"}
        </button>
      </div>

      <div>
        <Search onChange={setSearch} />
      </div>

      {sections.map((datos) => {
        return (
          <Seccion
            key={datos.id}
            datos={datos}
            onSubmit={handleSectionSubmit}
            onRename={handleRename}
            onDelete={handleRemoveSection}
            dragEnabled={dragEnabled}
            search={search}
          />
        );
      })}
    </>
  );
};

const Seccion = ({
  datos,
  onSubmit,
  onRename,
  onDelete,
  dragEnabled,
  search,
}) => {
  const [elements, setElements] = React.useState(datos.articulos ?? []);
  const [nombre, setNombre] = React.useState(datos.nombre ?? "");

  React.useEffect(() => {
    const body = { articulos: elements, id: datos.id };
    if (!_.isEqual(elements, body)) onSubmit(body);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elements]);

  const handleNewElement = () => {
    setElements([{ id: uuid() }, ...elements]);
  };

  const handleSubmit = (payload) => {
    const index = elements.findIndex((item) => item.id === payload.id);
    const data = [...elements];
    data[index] = payload;
    const body = { articulos: data, id: datos.id };
    if (!_.isEqual(elements, data)) {
      setElements(data);
      onSubmit(body);
    }
  };

  const handleDelete = (id) => {
    const index = elements.findIndex((item) => item.id === id);
    const data = [...elements];
    if (index > -1) {
      data.splice(index, 1);
      setElements(data);
      onSubmit({ articulos: data, id: datos.id });
    }
  };

  const handleSectionRename = (e) => onRename(e.target.value, datos.id);

  const onSortEnd = async ({ oldIndex, newIndex }) => {
    setElements((items) => arrayMove(items, oldIndex, newIndex));
  };

  const SortableItem = SortableElement(({ value }) => (
    <SortItemEditTeplate value={value} key={value.id} />
  ));

  const SortableList = SortableContainer(({ items }) => {
    return (
      <div key={"yay"}>
        {items.map((value, index) => (
          <SortableItem
            key={value.id}
            index={index}
            value={{ ...value, seccion: datos.nombre }}
          />
        ))}
      </div>
    );
  });

  return (
    <div style={styles.seccion}>
      <div>
        <input
          style={{
            border: "1px solid #999",
            borderRadius: 3,
            padding: 10,
            margin: "10px 0",
            boxSizing: "border-box",
          }}
          type="text"
          value={nombre}
          onChange={({ target }) => setNombre(target.value)}
          onBlur={handleSectionRename}
        />
      </div>

      <div>
        <button onClick={handleNewElement}>+ Crear articulo nuevo</button>
        <button style={styles.eliminarSeccion} onClick={() => onDelete(datos)}>
          - Borrar seccion
        </button>
      </div>

      {dragEnabled ? (
        <SortableList
          items={elements}
          onSortEnd={onSortEnd}
          lockAxis="y"
          lockToContainerEdges
          lockOffset="20%"
          useWindowAsScrollContainer
        />
      ) : (
        elements.map((data) => (
          <Articulo
            key={data.id}
            data={data}
            onSubmit={handleSubmit}
            onDelete={handleDelete}
            seccion={datos.nombre}
            search={search}
          />
        ))
      )}
    </div>
  );
};

const Articulo = ({ data, onSubmit, onDelete, seccion, disabled, search }) => {
  const imageInput = React.useState(data.imagen ?? "");
  const tituloInput = React.useState(data.titulo ?? "");
  const footerInput = React.useState(data.footer ?? "");
  const precioInput1 = React.useState(data.precio?.mayor ?? "");
  const precioInput2 = React.useState(data.precio?.detalle ?? "");
  const precioPrevioInput1 = React.useState(data.precioPrevio?.mayor ?? "");
  const precioPrevioInput2 = React.useState(data.precioPrevio?.detalle ?? "");
  const codigoInput1 = React.useState(data.codigos?.[0] ?? "");
  const codigoInput2 = React.useState(data.codigos?.[1] ?? "");
  const codigoInput3 = React.useState(data.codigos?.[2] ?? "");
  const agotadoInput = React.useState(data?.agotado ?? false);
  const ofertaInput = React.useState(data?.oferta ?? false);

  const [imageExists, setImageExists] = React.useState(null);
  const [show, setShow] = React.useState(true);
  const [, setNoImage] = React.useState(false);
  const [image, setImage] = React.useState(
    `./assets/${seccion}/${data.imagen}`
  );

  React.useEffect(() => {
    if (search.value.length) {
      const match =
        tituloInput[0].toUpperCase().indexOf(search.value.toUpperCase()) > -1;
      setShow(match);
    } else {
      setShow(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.value]);

  const payload = () => {
    const precios = { detalle: precioInput2[0], mayor: precioInput1[0] };
    const preciosPrevios = {
      detalle: precioPrevioInput2[0],
      mayor: precioPrevioInput1[0],
    };

    // Codigo
    const validacion = [codigoInput1[0], codigoInput2[0], codigoInput3[0]];
    const codigos = validacion.filter((item) => !!item);

    const body = {
      imagen: imageInput[0],
      titulo: tituloInput[0],
      precio: precios,
      precioPrevio: preciosPrevios,
      footer: footerInput[0],
      agotado: agotadoInput[0],
      oferta: ofertaInput[0],
      codigos,
      id: data.id,
    };

    return body;
  };

  const submit = (payload) => {
    checkImage(`../../assets/${seccion}/${payload.imagen}`)
      .then(({ exists }) => {
        setImageExists(exists);
        onSubmit(payload);
      })
      .catch((e) => {
        console.error(e);
        setImageExists(null);
      });
  };

  const handleInput = (value, setter, saveOnChange) => {
    setImageExists(null);
    setter(value);
    if (saveOnChange) submit({ ...payload(), [saveOnChange]: value });
  };

  const handleRemoveItem = () => {
    if (window.confirm("Desea borrar este elemento completamente?")) {
      onDelete(data.id);
    }
  };

  const handlePreviewImage = () =>
    window.open(`../../assets/${seccion}/${imageInput[0]}`, "_blank");

  const config = (input, typeValue = "value", saveOnChange = false) => ({
    [typeValue]: input[0],
    onChange: ({ target }) =>
      handleInput(target[typeValue], input[1], saveOnChange),
    ...(typeValue === "value" && { onBlur: () => submit(payload()) }),
    disabled: disabled,
  });

  React.useEffect(() => {
    checkImage(`../../assets/${seccion}/${imageInput[0]}`)
      .then(({ exists }) => {
        setImageExists(exists);
      })
      .catch((e) => {
        console.error(e);
        setImageExists(null);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleImageError = (e) => {
    setNoImage(true);
    setImage(NotFoundImage);
  };

  const handleScrollToItem = (e) => {
    e.preventDefault();
    search.cb({ value: "", setter: search.setter });
    search.setter("");

    e.target.scrollIntoView({ block: "start" });
  };

  if (!show) return <></>;

  return (
    <div
      id={tituloInput[0].replace(/\s/g, "").toLowerCase()}
      style={{
        display: "flex",
        flexDirection: "row",
        margin: 3,
        padding: 3,
        border: "1px solid #ddd",
        borderRadius: 10,
      }}
    >
      {/* Image */}
      <div>
        <img
          src={image}
          onError={handleImageError}
          alt={image}
          style={{
            width: 180,
            height: 180,
            objectFit: "cover",
          }}
        />
      </div>

      {/* Details */}
      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {!!search?.value?.length && (
          <div style={styles.field}>
            <button onClick={handleScrollToItem}>Scrollear hasta aqui </button>
          </div>
        )}

        <div style={styles.field}>
          <span>Image: </span>
          {imageExists ? (
            <>
              <button style={{ margin: "0 10px" }} onClick={handlePreviewImage}>
                imagen
              </button>
              <span style={{ color: "green" }}>&#10003;</span>
            </>
          ) : (
            <>
              <span style={{ color: "red", margin: "0 10px" }}>&#10005;</span>
              <span style={{ color: "red", margin: "0 10px" }}>&#10005;</span>
              <span style={{ color: "red", margin: "0 10px" }}>&#10005;</span>
            </>
          )}
          <input
            style={{ marginLeft: 10, borderRadius: 6, padding: "5px 10px" }}
            type="text"
            {...config(imageInput)}
          />
        </div>

        <div style={styles.field}>
          <span>Titulo: </span>
          <input
            style={{ marginLeft: 10, borderRadius: 6, padding: "5px 10px" }}
            type="text"
            {...config(tituloInput)}
          />
        </div>

        <div style={styles.field}>
          <span>Footer:</span>
          <input
            style={{ marginLeft: 10, borderRadius: 6, padding: "5px 10px" }}
            type="text"
            {...config(footerInput)}
          />
        </div>

        <div style={styles.field}>
          <span>Precios: </span>
          <div style={{ margin: "0 10px" }}>
            Al por mayor
            <input
              style={{
                borderRadius: 6,
                padding: "5px 10px",
                boxSizing: "border-box",
              }}
              type="text"
              {...config(precioInput1)}
            />
          </div>

          <div>
            Al detalle
            <input
              style={{
                borderRadius: 6,
                padding: "5px 10px",
                boxSizing: "border-box",
              }}
              type="text"
              {...config(precioInput2)}
            />
          </div>
        </div>

        <div style={styles.field}>
          <span>Codigo: </span>
          <div style={{ margin: "0 10px" }}>
            <input
              style={{
                borderRadius: 6,
                padding: "5px 10px",
                boxSizing: "border-box",
              }}
              type="text"
              {...config(codigoInput1)}
            />
          </div>

          <div>
            <input
              style={{
                borderRadius: 6,
                padding: "5px 10px",
                boxSizing: "border-box",
              }}
              type="text"
              {...config(codigoInput2)}
            />
          </div>

          <div style={{ margin: "0 10px" }}>
            <input
              style={{
                borderRadius: 6,
                padding: "5px 10px",
                boxSizing: "border-box",
              }}
              type="text"
              {...config(codigoInput3)}
            />
          </div>
        </div>

        <div style={styles.field}>
          <div>
            Agotado:
            <input
              style={{ width: 30 }}
              type="checkbox"
              {...config(agotadoInput, "checked", "agotado")}
            />
          </div>
        </div>

        <div style={styles.field}>
          <div>
            Oferta:
            <input
              style={{ width: 30 }}
              type="checkbox"
              {...config(ofertaInput, "checked", "oferta")}
            />
          </div>

          {ofertaInput[0] && (
            <div style={styles.field}>
              <span>Precios previos: </span>
              <div style={{ margin: "0 10px" }}>
                Al por mayor
                <input
                  style={{
                    borderRadius: 6,
                    padding: "5px 10px",
                    boxSizing: "border-box",
                  }}
                  type="text"
                  {...config(precioPrevioInput1)}
                />
              </div>

              <div>
                Al detalle
                <input
                  style={{
                    borderRadius: 6,
                    padding: "5px 10px",
                    boxSizing: "border-box",
                  }}
                  type="text"
                  {...config(precioPrevioInput2)}
                />
              </div>
            </div>
          )}
        </div>

        <div style={styles.field}>
          <div>
            <button style={{ width: "100%" }} onClick={handleRemoveItem}>
              borrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Generator;
