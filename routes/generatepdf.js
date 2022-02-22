const puppeteer = require("puppeteer");
// const fs = require("fs");

// Input
const address = "http://localhost:3000";

// function delay(time) {
//   return new Promise(function (resolve) {
//     setTimeout(resolve, time);
//   });
// }
const path = "./public/pdf/";

exports.generatePDF = async (req, res) => {
  const offset = req.body.offset;
  const defaultViewport = {
    width: 720,
    height: 1080,
  };
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--disable-gpu",
      "--full-memory-crash-report",
      "--unlimited-storage",
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      // `--window-size=${defaultViewport.width},${defaultViewport.height}`,
    ],
    defaultViewport,
  });

  // try {
  const page = await browser.newPage();

  const generatePDF = async (type, salesType) => {
    let filename = `${path}${type}${salesType}.pdf`;
    try {
      if (type === "print") {
        await page.pdf({
          path: filename,
          margin: { bottom: 0, left: 0, right: 0, top: 0 },
          printBackground: true,
          width: 720,
          scale: 1,
        });
      } else if (type === "mobile") {
        const height = await page.evaluate(
          () => document.documentElement.offsetHeight
        );

        await page.pdf({
          path: filename,
          margin: { bottom: 0, left: 0, right: 0, top: 0 },
          printBackground: true,
          scale: 1,
          height: height + offset,
          width: 720,
          pageRanges: "1",
        });
      }
    } catch (e) {
      console.error(e);
      filename = false;
    } finally {
      return { path: filename };
    }
  };

  await page.goto(address, { waitUntil: ["networkidle0", "domcontentloaded"] });
  await page.click(`#${req.body.type}`);

  const files = [];

  // Generar pdf "al por mayor"
  await page.click("#mayor");
  files.push(await generatePDF(req.body.type, "mayor"));

  await page.waitForNetworkIdle({
    waitUntil: ["networkidle0", "domcontentloaded"],
  });

  // Generar pdf "al detalle"
  await page.click("#detalle");
  files.push(await generatePDF(req.body.type, "detalle"));

  // Enviar archivos estaticos
  res.setHeader("Content-Type", "application/json");
  console.log("PDF GENERATED...");
  res.send({ files });

  // ? Enviar blobs. Static vs Blobs
  // const file = fs.createReadStream(`${path}${fileName}`);
  // const stat = fs.statSync(`${path}${fileName}`);
  // res.setHeader("Content-Length", stat.size);
  // res.setHeader("Content-Type", "application/pdf");
  // res.setHeader("Content-Disposition", "attachment; filename=quote.pdf");
  // file.pipe(res);
  // console.log("PDF GENERATED...");
  // console.log(`PATH: "file://${__dirname}/${fileName}"`);
  // open(`file://${__dirname}/${fileName}`);
  // } catch (e) {
  // console.error(e.message);
  // } finally {
  // browser.close();
  // }
};
