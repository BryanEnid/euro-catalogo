const puppeteer = require("puppeteer");
// const open = require("open");
const fs = require("fs");

// Input
const address = "http://localhost:3000";
const width = 720;

// Config
const fileName = "output.pdf";
const path = "./";

exports.generatePDF = async (req, res) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--disable-gpu", "--full-memory-crash-report", "--unlimited-storage", "--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", `--window-size=${width},${1000}`],
    defaultViewport: {
      width: width,
      height: 1000,
    },
  });

  try {
    const page = await browser.newPage();
    await page.goto(address, { waitUntil: "networkidle0" });

    if (req.body.salesType === "detalle") await page.click("#detalle");
    if (req.body.salesType === "mayor") await page.click("#mayor");
    await page.click("#ocultar");

    // Page dimension
    const elem = await page.$("html");
    const boundingBox = await elem.boundingBox();

    await page.pdf({
      path: `${path}${fileName}`,
      margin: { bottom: 0, left: 0, right: 0, top: 0 },
      omitBackground: false,
      printBackground: true,
      scale: 1,
      height: boundingBox.height + 20,
      width: width,
      pageRanges: "1",
    });

    const file = fs.createReadStream(`${path}${fileName}`);
    const stat = fs.statSync(`${path}${fileName}`);
    res.setHeader("Content-Length", stat.size);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=quote.pdf");
    file.pipe(res);

    console.log("PDF GENERATED...");
    // console.log(`PATH: "file://${__dirname}/${fileName}"`);
    // open(`file://${__dirname}/${fileName}`);
  } catch (e) {
    console.error(e.message);
  } finally {
    browser.close();
  }
};
