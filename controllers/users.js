const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ValidationError = require('../errors/ValidationError');

const {
  wrongCredentialsText,
  duplicateEmailText,
  invalidDataText,
  userIdNotFoundText,
} = require('../errors/errorsText');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError(wrongCredentialsText));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError(wrongCredentialsText));
          }

          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
            { expiresIn: '7d' },
          );

          return res
            .cookie('jwt', token, {
              maxAge: 3600000 * 24 * 7,
              httpOnly: true,
              sameSite: 'None',
            })
            .cookie('isLoggedIn', true, { sameSite: 'None' })
            .end();
        });
    })
    .catch(next);
};

module.exports.logout = (req, res, next) => {
  try {
    return res
      .cookie('jwt', 'delete', {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      })
      .cookie('isLoggedIn', false)
      .end();
  } catch (err) {
    return next(err);
  }
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then(() => {
      res.status(201).send({
        name,
        email,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError(duplicateEmailText));
      } else if (err instanceof mongoose.Error.ValidationError) {
        next(new ValidationError(invalidDataText));
      } else {
        next(err);
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { email, name } = req.body;

  User.findByIdAndUpdate(req.user._id, { email, name }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError(userIdNotFoundText);
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError(duplicateEmailText));
      } else if (err instanceof mongoose.Error.ValidationError) {
        next(new ValidationError(invalidDataText));
      } else {
        next(err);
      }
    });
};

module.exports.getUserMe = (req, res, next) => {
  const { _id } = req.user;

  User.findById(_id)
    .orFail(() => {
      throw new NotFoundError(userIdNotFoundText);
    })
    .then((user) => res.send(user))
    .catch(next);
};
