const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');
const User = require('../models/User');

const generateCertificate = async (userId) => {

  console.log('On generateCertificate');

  const user = await User.findById(userId);
  
  if (!user) throw new Error('User not found');

   // Define the path of the HTML template
   const templatePath = path.resolve(__dirname, '../templates/certificateTemplate.html');
  
   // Read the HTML file
   const htmlTemplate = fs.readFileSync(templatePath, 'utf-8');
   
   // Replace placeholders with dynamic content
   const html = htmlTemplate.replace('{{name}}', user.name);

   console.log('pdf generate started');

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(html);
  const pdfBuffer = await page.pdf({ format: 'A4',printBackground: true });
  
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
