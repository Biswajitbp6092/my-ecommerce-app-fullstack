const VerificationEmail = (name, otp) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
    body{
        font-family : Arial, sans-serif;
        margin : 0;
        padding : 0;
        background-color : #f4f4f4;
        color : #333;
        }
    .container{
        max-width : 600px;
        margin : 2px auto;
        background-color : #fff;
        padding : 20px;
        border-radius : 8px;
    }
    .header{
        text-align : center;
        padding-bottom : 20px;
        border-bottom : 1px solid #eee;
    }
    .header h1{
        color : #4CAF50;
    }

    .content{
        text-align : center;
    }
    .content p{
        font-size : 18px;
        line-height : 1.5;
    }
    .otp{
        font-size : 20px;
        font-weight : bold;
        color : #4CAF50;
        margin : 20px 0;
    }
    .footer{
        text-align : center;
        font-size : 14px;
        color : #777;
        margin-top : 20px;
    }    

    </style>
    </head>
    <body>
    <div class="container">
        <div class="header">
            <h1>hii ${name} please verify your Email Address</h1>
        </div>
        <div class="content">
            <p>Thank you for registring with Spicez Gold. Please use the OTP below to verify your email Address :</p>
            <div class="otp">${otp}</div>
            <p>If you didn't create an Account, You can sefly ignore this email</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Spicez Gold. All rights reserved.</p>

        </div>
    </div>
    </body>
    `;
};

export default VerificationEmail;
