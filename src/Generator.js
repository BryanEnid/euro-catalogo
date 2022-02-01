import React from 'react';
import './styles/tables.css';
import uuid from 'react-uuid';
import { download, checkImage } from './utils';

const styles = {
  seccion: {
    background: 'white',
    margin: 10,
    borderRadius: 5,
    padding: 20,
  },
  icon: {
    position: 'relative',
  },
};

const Generator = () => {
  const [sections, setSections] = React.useState(null);
  const [sectionName, setSectionName] = React.useState();
  const fileRef = React.useRef();

  const handleCreateSection = () => {
    if (sectionName) {
      setSections([...sections, { nombre: sectionName, id: uuid() }]);
      setSectionName('');
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
    setSections(data);
  };

  const handleRename = (value, id) => {
    const index = sections.findIndex((item) => item.id === id);
    const data = [...sections];
    data[index] = { ...data[index], nombre: value };
    setSections(data);
  };

  // Render "Upload File"
  if (!sections) {
    return (
      <>
        <input type="file" onChange={handleFileUpload} />
        <button onClick={() => setSections([])}>Generar nuevo spreadsheet</button>
      </>
    );
  }

  return (
    <>
      <input
        value={sectionName}
        onChange={(v) => setSectionName(v.target.value)}
        onKeyUp={({ key }) => key === 'Enter' && handleCreateSection()}
        placeholder="Nombre de la seccion"
        type="text"
      />
      <button onClick={handleCreateSection}>Crear</button>

      <button onClick={() => fileRef.current.click()}>Importar</button>
      <input style={{ display: 'none' }} onChange={handleFileUpload} type="file" ref={fileRef} />

      <button onClick={() => download(sections)}>Exportar</button>

      {sections.map((datos) => (
        <Seccion datos={datos} onSubmit={handleSectionSubmit} onRename={handleRename} />
      ))}
    </>
  );
};

const Seccion = ({ datos, onSubmit, onRename }) => {
  const [elements, setElements] = React.useState(datos.articulos ?? []);

  const handleNewElement = () => {
    setElements([...elements, { id: uuid() }]);
  };

  const handleSubmit = (payload) => {
    const index = elements.findIndex((item) => item.id === payload.id);
    const data = [...elements];
    data[index] = payload;
    setElements(data);
    onSubmit({ articulos: data, id: datos.id });
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

  return (
    <div style={styles.seccion}>
      <input type="text" value={datos.nombre} onChange={handleSectionRename} />

      <table className="table_container">
        <thead>
          <th style={{ width: '25%' }}>Nombre Imagen</th>
          <th style={{ width: '43%' }}>Titulo</th>
          <th style={{ width: '5%' }}>Precio</th>
          <th style={{ width: '25%' }}>Codigos</th>
          <th style={{ width: '2%' }}></th>
        </thead>

        {elements.map((data) => (
          <Articulo data={data} onSubmit={handleSubmit} onDelete={handleDelete} />
        ))}
      </table>
      <button onClick={handleNewElement}>+ Crear articulo nuevo</button>
    </div>
  );
};

const Articulo = ({ data, onSubmit, onDelete }) => {
  const imageInput = React.useState(data.imagen ?? '');
  const tituloInput = React.useState(data.titulo ?? '');
  const precioInput = React.useState(data.precio ?? '');
  const codigoInput1 = React.useState(data.codigos?.[0] ?? '');
  const codigoInput2 = React.useState(data.codigos?.[1] ?? '');
  const codigoInput3 = React.useState(data.codigos?.[2] ?? '');
  const [imageExists, setImageExists] = React.useState(null);

  const payload = () => {
    const validacion = [codigoInput1[0], codigoInput2[0], codigoInput3[0]];
    const codigos = validacion.filter((item) => !!item);

    return {
      imagen: imageInput[0],
      titulo: tituloInput[0],
      precio: precioInput[0],
      codigos,
      id: data.id,
    };
  };

  const submit = (payload) => {
    checkImage(`./assets/${payload.imagen}`)
      .then(({ exists }) => {
        setImageExists(exists);
        onSubmit(payload);
      })
      .catch((e) => {
        console.error(e);
        setImageExists(null);
      });
  };

  const handleInput = (value, setter) => {
    setImageExists(null);
    setter(value);
  };

  const handleRemoveItem = () => {
    if (window.confirm('Desea borrar este elemento completamente?')) {
      onDelete(data.id);
    }
  };

  const config = (input) => ({
    value: input[0],
    onChange: ({ target }) => handleInput(target.value, input[1]),
    onBlur: () => submit(payload()),
  });

  React.useEffect(() => {
    checkImage(`./assets/${imageInput[0]}`)
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
    <>
      <tr>
        <td>
          <input type="text" {...config(imageInput)} />
          {imageExists !== null && (
            <div className="icon">
              {imageExists ? (
                <span style={{ color: 'green' }}>&#10003;</span>
              ) : (
                <span style={{ color: 'red' }}>&#10005;</span>
              )}
            </div>
          )}
        </td>
        <td>
          <input type="text" {...config(tituloInput)} />
        </td>
        <td>
          <input type="text" {...config(precioInput)} />
        </td>
        <table>
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
        </table>
        <td>
          <button onClick={handleRemoveItem}>borrar</button>
        </td>
      </tr>
    </>
  );
};

export default Generator;
