import jwt from 'jsonwebtoken';
import { CustomJwtPayload } from '../util/jwt';
import logger from '../util/logger';
import { config } from '../util/config';
import { User } from '../orm/entities/User';
import { AppDataSource } from '../orm/ormconfig';
import { VdsError } from '../util/vds-error/vdsError';
import nodemailer from 'nodemailer';

/**
 * @description validates the passed username and password and generates a jwt token.
 * returns the user data along with the jwt token.
 */
export async function loginUser(email: string, password: string) {
  try {
    // Validate email & password
    if (!email || !password) {
      throw new VdsError(400, 'General', `All fields are required`, [
        `Both email and password fields are required to login`
      ]);
    }

    // Check the user registeration
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { email } });
    if (!user) {
      throw new VdsError(401, 'Unauthorized', `Not a registered user`, [
        `'${email}' is not a registered user`
      ]);
    }

    // Check the registered user password
    const isMatch = user.checkIfPasswordMatches(password);
    if (!isMatch) {
      throw new VdsError(401, 'Unauthorized', `Invalid credential`, [
        `Invalid email '${email}' or password '${password}'`
      ]);
    }

    // Generate JWT Token
    const jwtPayload: CustomJwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role
    };
    const token = jwt.sign(jwtPayload, config.jwt.access_token_secret!);

    return {
      email: user.email,
      role: user.role,
      name: user.name,
      accessToken: token
    };
  } catch (error) {
    logger.error(`Cannot login user ${email}`);
    // Re-throw the error for the controller to handle
    throw error;
  }
}

/**
 * @description register a new user and return its data
 */
export async function registerUser(
  email: string,
  password: string,
  name: string,
  role: number
) {
  try {
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { email } });

    // Check if existing user using this email
    if (user)
      throw new VdsError(400, 'General', 'User creation failed', [
        `The email '${user.email}' is already in use`
      ]);

    // Create new user
    const newUser = new User();
    newUser.email = email;
    newUser.password = password;
    newUser.role = role;
    newUser.name = name;
    newUser.hashPassword();
    const savedUser = await userRepo.save(newUser);

    // Generate JWT Token
    const jwtPayload: CustomJwtPayload = {
      id: savedUser.id,
      email: savedUser.email,
      role: savedUser.role
    };
    const token = jwt.sign(jwtPayload, config.jwt.access_token_secret!);

    return {
      email: savedUser.email,
      role: savedUser.role,
      name: savedUser.name,
      accessToken: token
    };
  } catch (error) {
    logger.error(`Cannot register user '${email}'`);
    // Re-throw the error for the controller to handle
    throw error;
  }
}

/**
 * @description Get the logged in user profile data
 */
export async function userProfile(req) {
  return {
    email: req.user.email,
    role: req.user.role,
    name: req.user.name
  };
}

/**
 * @description Send a password reset link to the registered user email valid upto next 60 minutes
 */
export async function forgotPass(email: string) {
  try {
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { email } });

    // Check if user exists with this email
    if (!user) {
      throw new VdsError(404, 'Not Found', 'User not found', [
        `User with this email '${email}' does not exist`
      ]);
    }

    // Generate JWT Token
    const jwtPayload: CustomJwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role
    };
    const resetToken = jwt.sign(jwtPayload, config.jwt.access_token_secret!, {
      expiresIn: '1h'
    });

    // Update the user with the resetToken
    user.resetPasswordToken = resetToken;

    // Set the email sender/transport creds
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.nodeMailerAuth.user,
        pass: config.nodeMailerAuth.pass
      }
    });

    // Format password reset email
    const mailOptions = {
      from: '"noreply@fitoffice.com" <usama.aslam.dev@gmail.com>',
      to: user.email,
      subject: 'Password Reset',
      text:
        `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n` +
        `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
        `http://${config.clientRootURL}/on-boarding/reset-password/?token=${resetToken}\n\n` +
        `Its valid upto next 60 minutes\n\n` +
        `If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      throw new VdsError(500, 'Internal Server', 'Internal Server Error', [
        `Error sending password reset email to ${email}`
      ]);
    }

    // If email is sended then save the user
    await userRepo.save(user);
    return { message: 'Password reset email sended' };
  } catch (error) {
    logger.error(`Not sending password reset email to '${email}'`);
    // Re-throw the error for the controller to handle
    throw error;
  }
}

/**
 * @description Verify the reset token and update the user's password
 */
export async function resetPass(newPassword: string, resetToken: string) {
  try {
    // Validate newPassword & resetToken
    if (!newPassword || !resetToken) {
      throw new VdsError(400, 'Validation', `All fields are Required`, [
        `Enter the valid password to reset`
      ]);
    }

    try {
      // Verify the token
      const decodedToken = jwt.verify(
        resetToken,
        config.jwt.access_token_secret!
      ) as CustomJwtPayload;
      const { userId } = decodedToken;

      // Get the user from repo on the basis of user id and token
      const userRepo = AppDataSource.getRepository(User);
      const user = await userRepo.findOne({
        where: {
          id: userId,
          resetPasswordToken: resetToken
        }
      });

      // Update user's password
      if (user) {
        user.password = newPassword;
        user.hashPassword();
        user.resetPasswordToken = null;
        await userRepo.save(user);
        return { message: 'Password reset successfully' };
      } else {
        throw new VdsError(404, 'General', 'User not found');
      }
    } catch {
      throw new VdsError(400, 'General', 'Invalid reset link', [
        `The password reset link may be expired or invalid`
      ]);
    }
  } catch (error) {
    logger.error(`Password reset error: ${error.message}`);
    // Re-throw the error for the controller to handle
    throw error;
  }
}
