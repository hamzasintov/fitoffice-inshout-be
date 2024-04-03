import jwt from 'jsonwebtoken';
import { CustomJwtPayload } from '../util/jwt';
import logger from '../util/logger';
import { config } from '../util/config';
import { User } from '../orm/entities/User';
import { AppDataSource } from '../orm/ormconfig';
import { VdsError } from '../util/vds-error/vdsError';
import { error } from 'console';

/**
 * @description validates the passed username and password and generates a jwt token.
 * returns the user data along with the jwt token.
 */
export async function loginUser(email: string, password: string) {
  try {
    //validate email & password
    if (!email || !password) {throw new VdsError(400, 'Validation', `All fields are Required`, [`Both Email and Password fields are required to Login`])}

    //check the user registeration
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { email } });
    if (!user) {throw new VdsError(401, 'Unauthorized', `Not a Registered user`, [`User '${email}' is not a Registered user`])}

    //check the registered user password
    const isMatch = user.checkIfPasswordMatches(password);
    if (!isMatch) {throw new VdsError(401, 'Unauthorized', `InValid Credential`, [`Provided email '${email}' & password '${password}' are not valid`])}

    // Generate JWT Token
    const jwtPayload: CustomJwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    const token = jwt.sign(jwtPayload, config.jwt.access_token_secret!);
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token: token };

  } catch (error) {
    logger.error(`Cannot login user`);
    return error;
  }
}

/**
 * @description register a new user and return its data
 */
export async function registerUser(email: string, password: string, name: string, role: number) {
  try {
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { email }});
    if (user) throw new VdsError(400, 'General' , 'User already exists', [` Email '${user.email}' already exists`] );
    const newUser = new User();
    newUser.email = email;
    newUser.password = password;
    newUser.role = role;
    newUser.name = name;
    newUser.hashPassword();
    await userRepo.save(newUser);
    return { user: { ...newUser } };
  } catch (error) { 
    logger.error(`Cannot register user '${email}'`)
    return error;
  }
}