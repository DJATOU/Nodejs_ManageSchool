const nodemailer = require("nodemailer");

var expediteur = 'ecole.wahran@gmail.com'

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: expediteur,
    pass: 'Wahran-31'
  }
});


var mailOptions = {
  from: expediteur,
  to: '',
  subject: '',
  text: ''
};
 
function sendEmail(argument){
    transporter.sendMail(argument, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}


module.exports = {sendEmail, expediteur, mailOptions};