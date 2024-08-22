const nodemailer = require('nodemailer');
require("dotenv").config({ path: "./.env" });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user : process.env.NODEMAILER_USER,
    pass : process.env.NODEMAILER_PASS
  }
});

const sendMailOnRegister = async (email = '', name='') => {
   console.log(' On sendMailOnRegister', name,email);
    const mailOptions = {
        from: process.env.NODEMAILER_USER,
        to: `${email},Lalit.lkp@gmail.com,sekharmohanta2020@gmail.com` ,
        subject: 'You have registered to Hudo Academy',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #dddddd;">
          <div style="text-align: center;">
            <img src="https://via.placeholder.com/150x50?text=Hudo+Logo" alt="Hudo Academy Logo" style="width: 150px; height: 50px;">
          </div>
          <div style="padding: 20px;">
            <p>Dear <strong>{{name}}</strong>,</p>
            <p>Welcome to Hudo Academy. You can now access our portal using this email address and the password you entered during registration. Please continue with filling out your profile and registering for the program.</p>
            <p>Thanks and Regards,</p>
            <p><strong>Hudo Academy</strong></p>
          </div>
          <div style="text-align: center; padding: 10px; background-color: #f1f1f1; border-top: 1px solid #dddddd;">
            <p>Hudo Academy</p>
            <p>Wework, Rajapushpa Summit, Financial District</p>
            <p>Hyderabad, Telangana, 500032</p>
          </div>
        </div>
      `.replace('{{name}}', name), 
      };

      // transporter.sendMail(mailOptions, (error, info) => {
      //   if (error) {
      //     console.log('Error sending email:', error);
      //   } else {
      //     console.log('Email sent:', info.response);
      //   }
      // });

      try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
      } catch (error) {
        console.error('Error sending email:', error);
      }
}

module.exports = sendMailOnRegister