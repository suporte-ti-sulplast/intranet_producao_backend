const nodemailer = require('nodemailer');

function sendEmailPassword(nameComplete, e_mail, password) {

    const nome = nameComplete.split(' '); 
    const email = e_mail;
    const senha = password;

    const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'smtp.mailgun.org',
    port: process.env.MAIL_PORT || 587,
    secure: false, // Para TLS
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  async function sendEmail() {
    try {
      const mailSent = await transporter.sendMail({
        from: process.env.MAIL_FROM_ADDRESS,
        to: email,
        subject: "Alteração de senha da INTRANET",
        html: `
          <br>
          <p>Olá, <strong>${nome[0].toUpperCase()}</strong>.</p>
          <p>Sua senha foi alterada com sucesso!</p>
          <p>Sua nova senha é:</p>
          <p><strong>${senha}</strong></p>
          <p>Caso você não tenha feito essa alteração, entre em contato com o TI.</p>
        `,
      });
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      return ('Erro ao enviar e-mail!');
    }
  }
  
  sendEmail();

  return ('Email enviado com sucesso!');

}


//ENVIO DE EMAIL PARA CRIAÇÃO EDIÇÃO DE IT
function sendEmailIT(users, it, tipo){

  const sendEmailNewIT = async (users, it, tipo) => {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || 'smtp.mailgun.org',
      port: process.env.MAIL_PORT || 587,
      secure: false, // Para TLS
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  
    const successfulEmails = [];
    const failedEmails = [];
  
    for (const user of users) {
      try {
        await sendEmail(transporter, user, it, tipo);
        successfulEmails.push(user.nameComplete);
      } catch (error) {
        console.error(`Erro ao enviar e-mail para ${user.nameComplete}:`, error);
        failedEmails.push(user.nameComplete);
      }
    }
  
    if (successfulEmails.length > 0) {
      console.log(`E-mails enviados com sucesso para: ${successfulEmails.join(', ')}`);
    }
  
    if (failedEmails.length > 0) {
      console.error(`Erro ao enviar e-mails para: ${failedEmails.join(', ')}`);
    }
  };
  
  const sendEmail = async (transporter, user, it, tipo) => {
    const { nameComplete, email } = user;
    let texto;
    if (tipo === 'novaIT') {
      texto = 'Há uma nova Instrução de Trabalho disponível para seu setor!';
    } else {
      texto = 'Houve uma alteração na Instrução de Trabalho:';
    }
  
    try {
      const mailSent = await transporter.sendMail({
        from: process.env.MAIL_FROM_ADDRESS,
        to: email,
        subject: tipo === 'novaIT' ? 'Nova IT' : 'Alteração IT',
        html: `
          <br>
          <p>Olá, <strong>${nameComplete.split(' ')[0].toUpperCase()}</strong>.</p>
          <p>${texto}</p>
          <p><strong>${it}</strong></p>
          <p>Você pode acessar através da INTRANET -> SGIs -> ITs.</p>
          <p>At.te, Tecnologia da Informação</p>
        `,
      });
      console.log('Email enviado com sucesso para: ', email);
      return 'Email enviado com sucesso!';
    } catch (error) {
      throw new Error('');
    }
  };

  sendEmailNewIT(users, it, tipo)
  return 'Email enviados com sucesso!';
} 

function sendEmailVoucher(horas, email) {

  const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || 'smtp.mailgun.org',
  port: process.env.MAIL_PORT || 587,
  secure: false, // Para TLS
  auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  async function sendEmail() {
    try {
      const mailSent = await transporter.sendMail({
        from: process.env.MAIL_FROM_ADDRESS,
        to: email,
        subject: "Gerar Voucher de Wifi",
        html: `
          <br>
          <p>Olá, <strong>Sr. Leandro</strong>.</p>
          <p>Favor gerar novos vouchers de wifi para ${horas} horas.</p>
          <p>Obrigado.</p>
        `,
      });
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      return ('Erro ao enviar e-mail!');
    }
  }

  sendEmail();

  return ('Email enviado com sucesso!');

};
  


module.exports = {sendEmailPassword, sendEmailIT, sendEmailVoucher};