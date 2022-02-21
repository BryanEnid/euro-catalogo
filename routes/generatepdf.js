const puppeteer = require("puppeteer");
// const fs = require("fs");

// Input
const address = "http://localhost:3000";

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

exports.generatePDF = async (req, res) => {
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
    const filename = `./${type}${salesType}.pdf`;
    if (type === "print") {
      await page.pdf({
        path: filename,
        margin: { bottom: 0, left: 0, right: 0, top: 0 },
        printBackground: true,
        width: 720,
        scale: 1,
      });
    } else if (type === "mobile") {
      const elem = await page.$("html");
      const boundingBox = await elem.boundingBox();
      await page.pdf({
        path: filename,
        margin: { bottom: 0, left: 0, right: 0, top: 0 },
        // omitBackground: false,
        // printBackground: true,
        scale: 1,
        height: boundingBox.height,
        width: boundingBox.width, // TODO
        pageRanges: "1",
      });
    }
  };

  await page.goto(address, { waitUntil: ["networkidle0", "domcontentloaded"] });
  await page.click(`#${req.body.type}`);

  // Generar pdf "al por mayor"
  await page.click("#mayor");
  // await delay(4000);
  await generatePDF(req.body.type, "mayor");

  // Generar pdf "al detalle"
  await page.click("#detalle");
  // await delay(4000);
  await generatePDF(req.body.type, "detalle");

  // Enviar archivos
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
