import signale from 'signale';

import { RouteType, sleep } from './../router';
import UserService from './service';
import HTTP from './../httpStatus';
import Auth from './../auth';

const checkToken: RouteType = async (req, res) => {
  const token = Auth.getRequestToken(req);
  if (!token) {
    signale.warn('token not present');
    return res.sendStatus(HTTP.BAD_REQUEST);
  }

  const userId = await Auth.getUserIdFromToken(token);

  if (userId) {
    const { username, _id } = await UserService.getUserById(userId);
    await sleep();
    return res.send({ userId: _id, username });
  }

  res.sendStatus(HTTP.BAD_REQUEST);
};

const login: RouteType = async (req, res) => {
  const { username } = req.body;

  if (!username) {
    signale.error('username is mandatory param');
    res.sendStatus(HTTP.BAD_REQUEST);
    return;
  }

  const user = await UserService.getUser(username);
  if (user) {
    const token = await Auth.generateToken(user.id);
    signale.success(`token generated for [${username}]`);

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: true
    });

    return res.send({ username, userId: user.id });
  }

  signale.error(`cannot login for user [${username}]`);
  res.sendStatus(HTTP.BAD_REQUEST);
};

const logout: RouteType = async (req, res) => {
  const token = Auth.getRequestToken(req);
  if (!token) {
    signale.warn('token not present');
    return res.sendStatus(HTTP.BAD_REQUEST);
  }

  const userId = await Auth.getUserIdFromToken(token);

  if (userId) {
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: true
    });

    return res.sendStatus(200);
  }

  res.sendStatus(HTTP.BAD_REQUEST);
};

const getAllUsers: RouteType = async (_, res) => {
  const users = await UserService.getAllUsers();
  res.send(users);
};

const createUser: RouteType = async (req, res) => {
  const userParams = req.body;
  const userCreated = await UserService.createUser(userParams);
  if (userCreated) {
    signale.success(`[${userParams.username}] created!`);
    res.sendStatus(HTTP.CREATED);
    return;
  }

  signale.error(`cannot create [${userParams.username}]`);
  res.sendStatus(HTTP.BAD_REQUEST);
};

const UserControllerFactory = () => ({
  checkToken,
  login,
  logout,
  getAllUsers,
  createUser
});

export default UserControllerFactory;
