const express = require('express');``
const router = express.Router();
const authenticate = require('../middleware/auth');
const generateCertificate = require('../pdfGenerater/certificate');
const fs = require('fs').promises;

router.get('/downloadCertificate', authenticate, async (req, res) => {
    try {
        console.log('certificate download started');

        const pdfStream = await generateCertificate(req.userId);
        pdfStream.on('error', (error) => {
            console.error('Error occured while streaming certificate', {
               args: {
                  error: error?.message,
                  stack: error?.stack,
               },
            });
            if (!res.headersSent) {
               res.setHeader('content-type', 'application/json');
               res.removeHeader('content-disposition');
               res.status(500).send('Sorry! something went wrong. Unable to fetch invoice excel');
            }
         });
        
        console.log('header setting');

        res.setHeader('Content-Disposition', 'attachment; filename=certificate.pdf');
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('X-Content-Name', `certificate.pdf`);
        res.attachment(`certificate.pdf`);

        console.log('response sent');
        // res.send(pdfBuffer);
        pdfStream.pipe(res);
    } catch (error) {
        console.error('Error generating certificate:', error);
        res.status(500).send({
            message:'Error generating certificate',
            error: error
        });
    }
});

module.exports = router;
