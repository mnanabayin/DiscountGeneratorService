require('dotenv').config()
//EMAIL

module.exports.SendEmail = (brand) =>
{
    var nodemailer = require('nodemailer');

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: process.env.TEST_EMAIL,
        pass: process.env.TEST_PASS
        }
    });
    
    var mailOptions = {
        from: process.env.TEST_EMAIL,
        to: brand.email,
        subject: 'Discount Code ['+brand.code+'] taken!',
        text: 'Your discount code ['+brand.code+'] has been taken.' 
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
        console.log(error);
        } else {
        console.log('Email sent: ' + info.response);
        }
    });
}

