const nodemailer = require('nodemailer');

async function newMail(link, mail) {
    let transporter = await nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'cplazasmendivelso@gmail.com',
            pass: 'etupiviehitabvbl', // generated ethereal password
        },
    });
    let info = await transporter.sendMail({
        from: '"Cambio Contrasena 👻" <cplazasmendivelso@gmail.com>', // sender address
        //to: "jhonaelingeniero04@gmail.com", // list of receivers
        to: mail,
        subject: "Cambio Contrasena Login APP ✔",// plain text body
        html:
            "<p><strong>Cambio de contrasena: </strong>" + "<a href='http://localhost:3000/forgot/password/" + link + "' target='_blank'>Cambio Contrasena</a></p>"+
            "<p><strong>Recuerde que este link solo funciona una vez</strong></p>"
    });
}

module.exports = {newMail}