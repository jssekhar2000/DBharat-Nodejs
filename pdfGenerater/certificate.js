const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');
const Student = require('../models/Student');

const generateCertificate = async (userId) => {

  console.log('On generateCertificate');

  const user = await Student.findById(userId);
  
  if (!user) throw new Error('User not found');

   // Define the path of the HTML template
   const templatePath = path.resolve(__dirname, '../templates/certificateTemplate.html');
  
   // Read the HTML file
   const htmlTemplate = fs.readFileSync(templatePath, 'utf-8');
   
   // Replace placeholders with dynamic content
   const html = htmlTemplate.replace('{{name}}', user.name);

   console.log('pdf generate started');

  const browser = await puppeteer.launch({
    headless: true,
    ignoreDefaultArgs: ["--disable-extensions"],
    args: [
      "--no-sandbox",
      "--use-gl=egl",
      "--disable-setuid-sandbox",
    ],
    ignoreHTTPSErrors: true,
  });
  const page = await browser.newPage();

  await page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36")
  await page.setContent(html);

  // Calculate the size of the content dynamically
  const dimensions = await page.evaluate(() => {
    const body = document.body;
    return {
      width: body.scrollWidth,
      height: body.scrollHeight,
    };
  });


  // Set custom width and height for the PDF
  const pdfBuffer = await page.pdf({
    height: '550px',
    printBackground: true,
  });

  //const pdfBuffer = await page.pdf({ format: 'A4',printBackground: true });
  
  await browser.close();

  console.log('pdf generate completed');
  
  return await bufferToStream(pdfBuffer);
};

// Helper function to convert buffer to stream
const bufferToStream = (binary) => {
  const readableInstanceStream = new Readable({
     read() {
        this.push(binary);
        this.push(null);
     }
  });
  return readableInstanceStream;
};

module.exports = generateCertificate;
