const sgMail = require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRID_API_KEY)

sgMail.send({
    to:'sss41097@gmail.com',
    from:'sss41097@gmail.com',
    subject:'This is my first creation!',
    text:"OOoooooooOOoo Yeah"
})


const sendWelcomeEmail = (email, name) =>{
    sgMail.send({
        to:email,
        from:'sss41097@gmail.com',
        subject:'Thanks for joining in!',
        // ` ` used to inject names in string
        text:`Welcome, ${name}`
    })
}

const sendCancellationEmail = (email, name) =>{
    sgMail.send({
        to:email,
        from:'sss41097@gmail.com',
        subject:'Sorry to see u go!',
        // ` ` used to inject names in string
        text:`Please come back, ${name}`
    })
}


module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}

