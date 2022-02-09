import React from "react";
import "./tables.css";
import uuid from "react-uuid";
import { download, checkImage } from "../../utils";
import _ from "lodash";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { arrayMoveImmutable as arrayMove } from "array-move";
import SortItemEditTeplate from "./SortItemEditTemplate";
import { CircularProgress } from "@mui/material";

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
    background: "red",
    borderRadius: 4,
    color: "white",
    border: "1px solid red",
  },
};

const Generator = () => {
  const [sections, setSections] = React.useState(null);
  const [sectionName, setSectionName] = React.useState();
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
      console.log("saved");
    }
  }, [sections]);

  const handleCreateSection = () => {
    if (sectionName) {
      const data = [...sections, { nombre: sectionName, id: uuid() }];
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

  const generatePDF = async () => {
    const promises = [
      fetch("http://localhost:9000/generatePDF", {
        method: "POST",
        body: JSON.stringify({ salesType: "mayor" }),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      fetch("http://localhost:9000/generatePDF", {
        method: "POST",
        body: JSON.stringify({ salesType: "detalle" }),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      fetch("http://localhost:9000/generatePDF", {
        method: "POST",
        body: JSON.stringify({ salesType: "todos" }),
        headers: {
          "Content-Type": "application/json",
        },
      }),
    ];

    const responses = await Promise.all(promises);

    for await (const response of responses) {
      const blob = await response.blob();
      const file = URL.createObjectURL(blob);
      window.open(file);
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
      <input
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
      {/* <button onClick={() => handleSave(sections)}>Guardar</button> */}
      <button onClick={() => download(sections)}>Exportar</button>
      <button onClick={generatePDF}>Generar PDF</button>
      <button
        onClick={() => setDragEnabled(!dragEnabled)}
        style={{ color: !dragEnabled ? "black" : "red" }}
      >
        Ordenar {dragEnabled && "- ACTIVO"}
      </button>
      {sections.map((datos) => {
        return (
          <Seccion
            key={datos.id}
            datos={datos}
            onSubmit={handleSectionSubmit}
            onRename={handleRename}
            onDelete={handleRemoveSection}
            dragEnabled={dragEnabled}
          />
        );
      })}
    </>
  );
};

const Seccion = ({ datos, onSubmit, onRename, onDelete, dragEnabled }) => {
  const [elements, setElements] = React.useState(datos.articulos ?? []);
  const [nombre, setNombre] = React.useState(datos.nombre ?? "");

  React.useEffect(() => {
    const body = { articulos: elements, id: datos.id };
    if (!_.isEqual(elements, body)) onSubmit(body);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elements]);

  const handleNewElement = () => {
    setElements([...elements, { id: uuid() }]);
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
      <tbody>
        {items.map((value, index) => (
          <SortableItem
            index={index}
            value={{ ...value, seccion: datos.nombre }}
          />
        ))}
      </tbody>
    );
  });

  return (
    <div style={styles.seccion}>
      <input
        type="text"
        value={nombre}
        onChange={({ target }) => setNombre(target.value)}
        onBlur={handleSectionRename}
      />

      <table className="table_container">
        {!dragEnabled && (
          <thead>
            <th style={{ width: "2%" }}> </th>
            <th style={{ width: "25%" }}>Nombre Imagen</th>
            <th style={{ width: "35%" }}>Titulo</th>
            <th style={{ width: "7%" }}>
              Precio (Al por mayor) y (Al detalle)
            </th>
            <th style={{ width: "13%" }}>Codigos</th>
            <th style={{ width: "2%" }}>Agotado</th>
            <th style={{ width: "4%" }}></th>
          </thead>
        )}

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
            />
          ))
        )}
      </table>

      <div>
        <button onClick={handleNewElement}>+ Crear articulo nuevo</button>
      </div>
      <br />
      <div>
        <button style={styles.eliminarSeccion} onClick={() => onDelete(datos)}>
          - Borrar seccion
        </button>
      </div>
    </div>
  );
};

const Articulo = ({ data, onSubmit, onDelete, seccion, disabled }) => {
  const imageInput = React.useState(data.imagen ?? "");
  const tituloInput = React.useState(data.titulo ?? "");
  const precioInput1 = React.useState(data.precio?.mayor ?? "");
  const precioInput2 = React.useState(data.precio?.detalle ?? "");
  const codigoInput1 = React.useState(data.codigos?.[0] ?? "");
  const codigoInput2 = React.useState(data.codigos?.[1] ?? "");
  const codigoInput3 = React.useState(data.codigos?.[2] ?? "");
  const agotadoInput = React.useState(data.agotado ?? false);
  const [imageExists, setImageExists] = React.useState(null);

  const payload = () => {
    const precios = { detalle: precioInput2[0], mayor: precioInput1[0] };

    // Codigo
    const validacion = [codigoInput1[0], codigoInput2[0], codigoInput3[0]];
    const codigos = validacion.filter((item) => !!item);

    const body = {
      imagen: imageInput[0],
      titulo: tituloInput[0],
      precio: precios,
      agotado: agotadoInput[0],
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

  return (
    <tr>
      <td></td>

      <td>
        <input type="text" {...config(imageInput)} />
        {imageExists !== null && (
          <div
            className="icon"
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
            {imageExists ? (
              <>
                <span style={{ color: "green" }}>&#10003;</span>
                <button onClick={handlePreviewImage}>ver imagen</button>
              </>
            ) : (
              <span style={{ color: "red" }}>&#10005;</span>
            )}
          </div>
        )}
      </td>
      <td>
        <input type="text" {...config(tituloInput)} />
      </td>

      <td>
        <tr>
          <td>
            <input type="text" {...config(precioInput1)} />
          </td>
          <td>
            <input type="text" {...config(precioInput2)} />
          </td>
        </tr>
      </td>

      <td>
        <tr>
          <td>
            <input type="text" {...config(codigoInput1)} />
          </td>
          <td>
            <input type="text" {...config(codigoInput2)} />
          </td>
          <td>
            <input type="text" {...config(codigoInput3)} />
          </td>
        </tr>
      </td>

      <td>
        <input
          type="checkbox"
          {...config(agotadoInput, "checked", "agotado")}
        />
      </td>

      <span
        style={{
          display: "flex",
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button onClick={handleRemoveItem}>borrar</button>
      </span>
    </tr>
  );
};

export default Generator;
