const puppeteer = require("puppeteer");
const fs = require("fs");

// Input
const address = "http://localhost:3000";

const path = "./";

exports.generatePDF = async (req, res) => {
  const offset = Number(req.query.offset);
  const defaultViewport = {
    width: 720,
    height: 1280,
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
      `--window-size=${defaultViewport.width},${defaultViewport.height}`,
    ],
    defaultViewport,
  });

  const page = await browser.newPage();

  const generatePDF = async (type, salesType) => {
    // let filename = `${path}${type}${salesType}.pdf`;
    try {
      if (type === "print") {
        return await page.pdf({
          // path: filename,
          margin: { bottom: 0, left: 0, right: 0, top: 0 },
          printBackground: true,
          width: 720,
          height: 1280,
          scale: 1,
        });
      } else if (type === "mobile") {
        const doc = await page.$("html");
        const height = Math.floor((await doc.boundingBox()).height);

        return await page.pdf({
          // path: filename,
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
    }
  };

  await page.goto(address, { waitUntil: ["networkidle0", "domcontentloaded"] });
  await page.click(`#${req.query.type}`);

  let file;
  const filename = `${req.query.type}${req.query.sale}.pdf`;
  console.log(filename);

  // Generar pdf "al por mayor"
  if (req.query.sale === "mayor") {
    await page.click("#mayor");
    file = await generatePDF(req.query.type, "mayor");
  }

  // Generar pdf "al detalle"
  if (req.query.sale === "detalle") {
    await page.click("#detalle");
    file = await generatePDF(req.query.type, "detalle");
  }

  // Enviar archivos estaticos
  res.setHeader("Content-Type", "application/json");
  console.log("PDF GENERATED...");

  // Enviar blobs
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
  return res.end(file);
};
