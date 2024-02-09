import nodemailer from 'nodemailer'
import { Email } from './interface'
import cloudinary from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { google } from 'googleapis'
import { Paystack } from 'paystack-sdk'
import { config } from '../utils/utils'


export class Service {
    public static async email(data: Email) {
        try {
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: config().googelUser,
                    pass: config().googlePass
                }
            })

            const info = await transporter.sendMail({
                from: config().googelUser,
                to: data.to,
                subject: data.subject,
                html: data.html
            })
            if (!info) {
                console.log("Email not sent")
            }
            console.log("Email sent: % ", info.messageId)

        } catch (err) {
            throw err
        }
    }

    public static upload() {
        try {
            const storage = new CloudinaryStorage({
                cloudinary: cloudinary.v2,
                params: async (req, file) => {
                    return {
                        folder: 'conference-management-system',
                        format: ['jpeg', 'png'],
                    }
                }
            })
            return storage
        } catch (err) {
            throw err
        }
    }

    public static async OAuth2() {
        try {
            const providers = {
                google: {
                    oauth2Client: new google.auth.OAuth2({
                        clientId: '',
                        clientSecret: '',
                        redirectUri: ''
                    }),
                    scopes: ""
                }
            }
            
            return providers

        } catch (err) {
            throw err
        }

    }

    public static async payment() {
        try {
            const paystack = new Paystack("")

        } catch (err) {
            throw err
        }

    }
}