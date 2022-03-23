const UserModel = require('@src/models/user.model');
const bcrypt = require('bcrypt');

const checkUser = async (username, password) => {
  const user = await UserModel.findOne({ username });
  if (user && bcrypt.compareSync(password, user.password)) {
    return user;
  }
  return false;
};

const Auth = async (req, res, next) => {
  const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
  const [username, password] = Buffer.from(b64auth, 'base64').toString().split(':');
  if (!username) {
    return res.sendStatus(403);
  }
  if (!password) {
    return res.sendStatus(403);
  }

  try {
    const user = await checkUser(username, password);
    if (!user) {
      return res.sendStatus(403);
    }
    req.user = user;
    return next();
  } catch (er) {
    return res.sendStatus(403);
  }
};

module.exports = {
  Auth,
  checkUser,
};
