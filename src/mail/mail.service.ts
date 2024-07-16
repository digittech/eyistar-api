import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as moment from "moment";

const fs = require("fs");
const path = require("path");
const downloadPath = path.resolve('./download');
const handlebars = require("handlebars");
const today: any = moment().format("YYYY-MM-DD_HH:mm:ss");
import { ConfigService } from "@nestjs/config";
import * as nodemailer from 'nodemailer';
import * as nodemailerExpressHandlebars from 'nodemailer-express-handlebars';

const mailjet = require ('node-mailjet')
.connect('5e4c6a900c8fa6b436bd02b4dc312928', 'e06961412e2d2df60d998768e12acf9b')
// .connect('04212573e56b5bc3ce53a2ea7d7c42df', '99855f2749fa31264885819364aae031')


@Injectable()
export class MailService {

    appUrl = this.configService.get('APP_URL');
    webUrl = this.configService.get('WEB_URL');
    emailSender = this.configService.get('EMAIL_EMAIL');
    googleEmailUser = this.configService.get('GOOGLE_EMAIL_USER');
    googleEmailPassword = this.configService.get('GOOGLE_EMAIL_PASSWORD');
    constructor(
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService,
    ) {}

    async sendMail(email: string, name: string) {
        console.log(email);

        const mailRes = await this.mailerService
        .sendMail({
            to: `${name} <${email}>`, // list of receivers
            from: `"Konnect Admin" <${this.emailSender}>`, // sender address
            cc: [
                  {
                      address: "ayoadelala@yahoo.com",
                      name: "Engineering"
                  },
                  {
                      address: "o.olusegun@consukon.com",
                      name: "Olusegun Olumide"
                  }
              ],
          //   bcc: [''],
            subject: `Welcome to Konnect. Enjoy A Life Transforming Experience`, // Subject line
            template: path.join(process.cwd(), `templates/mobileappactivate`),
            context: {
                // "confirmation_link": `${this.webUrl}/auth/email_confirmation/6666778877`,
                "email": "ayoadelala@yahoo.com",
                "firstName": `${name}`,
                "recoveryCode": "1223456",
            }
        })
        .then((response) => { console.log('response', response); return response})
        .catch((err) => { console.log('err', err) });

        return mailRes

        console.log('mailRes', mailRes);
    }

    async invitation(data) {
    console.log(data);
    const googleEmailServiceAuth = {
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: this.googleEmailUser,
        pass: this.googleEmailPassword,
      },
      tls: {
        rejectUnauthorized: false
    }
    };
    const transporter = nodemailer.createTransport(googleEmailServiceAuth);

    transporter.use(
      'compile',
      nodemailerExpressHandlebars({
        viewEngine: {
        //   extName: '.hbs',
          partialsDir: path.join(process.cwd(), 'template'),
          layoutsDir: path.join(process.cwd(), 'template'),
          defaultLayout: '',
        },
        viewPath: path.join(process.cwd(), 'template'),
        extName: '.hbs',
      }),
    );
    const emailData = {
      from: `"AyoBolu23" <${this.emailSender}>`,
      to: `"${data.name}" <${data.email}>`,
      cc: [
        {
          address: 'ayoadelala@yahoo.com',
          name: 'Host',
        },
        {
          address: 'marvelpro788@gmail.com',
          name: 'Engineering',
        },
        {
          address: 'olusolagloryolamide@gmail.com',
          name: 'Engineering',
        },
      ],
      subject: `Invitation to AyoBolu2023, ${data.name}`,
      attachments: [
        {
          filename: '001.jpg',
          content: fs.readFileSync('src/assets/images/001.jpg'),
          cid: 'image1_cid',
        },
      ],
      template: 'invitation', // This should match the filename of your template without the file extension
      context: {
        name: data.name,
        url: data.url,
        pass_code: data.pass_code,
        table_for: data.table_for,
        no_guest: data.no_guest,
        no_table: data.no_table,
        invited_by: data.invited_by,
        event: data.event,
        is_accormodation: data.is_accormodation,
        gift_url: data.gift_url,
        room_for: data.room_for,
        room_price: data.room_price,
        engagement_add_url: data.engagement_add_url,
        engagement_address: data.engagement_address,
        church_add_url: data.church_add_url,
        church_address: data.church_address,
        reception_add_url: data.reception_add_url,
        reception_address: data.reception_address,
        support_email: data.support_email,
        live_chat_url: data.live_chat_url,
        help_url: data.help_url,
        action_url: data.action_url,
        email: data.email,
      },
    };

    transporter
      .sendMail(emailData)
      .then((info) => {
        console.log('Email sent:', info);
        return info;
      })
      .catch((error) => {
        console.error('Error sending email:', error);
      });

    // await this.sendMailWithGmail(
    //   `"AyoBolu23" <${this.emailSender}>`,
    //   `"${data.name}" <${data.email}>`,
    //   `Invitation to AyoBolu2023, ${data.name}`,
    //   `Hello ${data.name}, <br><br>
    //     You have been invited to AyoBolu2023. <br><br>
    //     Please click on the link below to confirm your invitation. <br><br>
    //     <a href="${data.url}">Confirm Invitation</a> <br><br>
    //     Pass Code: ${data.pass_code} <br><br>
    //     Table For: ${data.table_for} <br><br>
    //     No of Guest: ${data.no_guest} <br><br>
    //     No of Table: ${data.no_table} <br><br>
    //     Invited By: ${data.invited_by} <br><br>
    //     Event: ${data.event} <br><br>`,
    // );

    // const mailRes = await this.mailerService
    //   .sendMail({
    //     to: `"${data.name}" <${data.email}>`, // list of receivers
    //     from: `"AyoBolu23" <${this.emailSender}>`, // sender address
    //     cc: [
    //       {
    //         address: 'ayoadelala@yahoo.com',
    //         name: 'Host',
    //       },
    //       {
    //         address: 'marvelpro788@gmail.com',
    //         name: 'Engineering',
    //       },
    //       {
    //         address: 'olusolagloryolamide@gmail.com',
    //         name: 'Engineering',
    //       },
    //     ],
    //     //   bcc: [''],
    //     subject: `Invitation to AyoBolu2023, ${data.name}`, // Subject line
    //     template: path.join(process.cwd(), `template/invitation`),
    //     context: {
    //       name: data.name,
    //       url: data.url,
    //       pass_code: data.pass_code,
    //       table_for: data.table_for,
    //       no_guest: data.no_guest,
    //       no_table: data.no_table,
    //       invited_by: data.invited_by,
    //       event: data.event,
    //       is_accormodation: data.is_accormodation,
    //       gift_url: data.gift_url,
    //       room_for: data.room_for,
    //       room_price: data.room_price,
    //       engagement_add_url: data.engagement_add_url,
    //       engagement_address: data.engagement_address,
    //       church_add_url: data.church_add_url,
    //       church_address: data.church_address,
    //       reception_add_url: data.reception_add_url,
    //       reception_address: data.reception_address,
    //       support_email: data.support_email,
    //       live_chat_url: data.live_chat_url,
    //       help_url: data.help_url,
    //       action_url: data.action_url,
    //       // "confirmation_link": `${this.webUrl}/confirm-email/${data.id}`,
    //       email: data.email,
    //     },
    //   })
    //   .then((response) => {
    //     console.log('response', response);
    //     return response;
    //   })
    //   .catch((err) => {
    //     console.log('err', err);
    //   });

    // console.log('mailRes', mailRes);
    }

}
