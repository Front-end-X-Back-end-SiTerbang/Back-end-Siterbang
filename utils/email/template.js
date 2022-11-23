const htmlTemplateTop = `
<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="description" content="SiTerbang">
  <meta name="keywords" content="SiTerbang, Javascript, NodeJS, ExpressJS">
  <meta name="author" content="Deny Septian, Febi Ago, Izaz Rizqullah">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <style>
    @import "https://fonts.googleapis.com/css2?family=Open+Sans&display=swap";

    * {
      font-family: "Open Sans", sans-serif;
      box-sizing: border-box;
    }

    .auth-title {
      text-align: center;
      color: white;
      margin: 0;
      margin-top: 30px;
      margin-bottom: 10px;
    }

    .auth-content {
      border: 2px solid #0a1d37;
      border-radius: 3px;
      line-height: 30px;
      max-width: 800px;
      margin: 0 auto;
      margin-bottom: 30px;
      padding: 25px;
    }

    .auth-button {
      background-color: #6c63ff;
      text-decoration: none;
      text-align: center;
      border-radius: 5px;
      font-weight: bold;
      margin: 0 auto;
      padding: 5px;
      display: block;
      width: 150px;
  }
  </style>

  <title>Verify Your Account!</title>
</head>

<body style="background-color: #6c63ff; padding: 20px;">
  <h1 class="auth-title">
    Si Terbang
  </h1>

  <div class="auth-content" style="background-color: white;">
    <p style="font-size: 20px;">Hello! Welcome To Our Apps</p>

    <hr>`;

const htmlTemplateBottom = `
  </div>
</body>
</html>`;

module.exports = { htmlTemplateTop, htmlTemplateBottom };
