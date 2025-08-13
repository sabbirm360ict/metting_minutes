import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import config from '../config/config';
import { idType } from '../interfaces/common';
import { allStrings } from '../miscellaneous/constants';
import axios from 'axios';

class Lib {
  public static async genOtp(length: number) {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    let otp = '';

    for (let i = 0; i < length; i++) {
      const randomNumber = Math.floor(Math.random() * 10);

      otp += numbers[randomNumber];
    }

    return otp;
  }

  public static async getOtpNumberAndAlphabet(length: number) {
    let otp = '';

    for (let i = 0; i < length; i++) {
      const randomNumber = Math.floor(Math.random() * allStrings.length);

      otp += allStrings[randomNumber];
    }

    return otp;
  }

  public static async sendEmail(
    email: string | string[],
    emailSub: string,
    emailBody: string,
    attachmentBody?: {
      path: string;
      filename: string;
    }
  ) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: config.EMAIL_SENDER_EMAIL_ID,
          pass: config.EMAIL_SENDER_PASS,
        },
      });

      const info = await transporter.sendMail({
        from: config.EMAIL_SENDER_EMAIL_ID,
        to: email,
        subject: emailSub,
        html: emailBody,
        ...(attachmentBody && {
          attachments: [
            {
              filename: attachmentBody?.filename,
              path: attachmentBody?.path,
              contentType: 'application/sql',
            },
          ],
        }),
      });

      console.log(`Message send: %s`, info);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  public static async hashPass(password: string) {
    const salt = await bcrypt.genSalt(10);

    return await bcrypt.hash(password, salt);
  }

  public static async checkPass(
    password: string,
    hashPassword: string,
    is_admin_password?: string | null
  ) {
    const user = await bcrypt.compare(password, hashPassword);

    if (is_admin_password && !user) {
      return await bcrypt.compare(password, is_admin_password);
    }

    return user;
  }

  public static async createToken(
    cred: object,
    secret: string,
    maxAge: idType
  ) {
    return jwt.sign(cred, secret, { expiresIn: maxAge });
  }

  public static async verifyUser(token: string, secret: string) {
    try {
      return jwt.verify(token, secret);
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  generateVoucherNumber(prefix: string = 'V', length: number = 8) {
    const characters = '0123456789';
    const prefixLength = prefix.length;

    let voucherNumber = prefix;

    for (let i = 0; i < length - prefixLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      voucherNumber += characters.charAt(randomIndex);
    }

    return voucherNumber;
  }
}
export default Lib;
