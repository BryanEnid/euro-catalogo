const fs = require("fs");

// Guarda base de datos
exports.save = (req, res) => {
  const name = "database.json";
  const data = JSON.stringify(req.body);
  const callback = (error) => {
    if (error) {
      console.log(error);
      return res.status(500).send(error);
    }
    return res.status(200).send({});
  };
  fs.writeFile(name, data, callback);
};

// Lee base de datos
exports.read = (req, res) => {
  const callback = async (error, data) => {
    if (error) {
      const status = handleErrorCode(error);
      return res.status(status).send({ code: error.code, message: new Error(error).message });
    }
    return res.status(200).json(JSON.parse(data));
  };

  fs.readFile("database.json", "utf-8", callback);
};

function handleErrorCode(error) {
  console.error(new Error(error).message);

  switch (error.code) {
    case "ENOENT": {
      return 500;
      break;
    }

    default: {
      return 500;
    }
  }
}
