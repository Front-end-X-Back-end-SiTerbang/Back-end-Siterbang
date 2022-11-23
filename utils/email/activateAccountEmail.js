const { htmlTemplateTop, htmlTemplateBottom } = require("./template");

const activateAccount = (link) => {
  const htmlContent = `
  <p>
    You received this email because your account has been registered at SiTerbang
    <br>
    Immediately activate your account by clicking the button below.
  </p>
  
  <a href="${link}" style="color: white;" class="auth-button">Activate Account</a>
  
  <p>
  If you don't feel like registering an account at SiTerbang, please ignore this email.
    <br>
    Link alternatif: <a href="${link}">${link}</a>
  </p>
  

  <hr>
  
  <p>Copyright &copy; ${new Date().getFullYear()} SiTerbang`;

  return htmlTemplateTop + htmlContent + htmlTemplateBottom;
};

module.exports = activateAccount;
