const { AuthenticationError } = require('apollo-server-express');

const { User } = require('../models');
const { signToken } = require('../utils/auth');

module.exports = {
  Query: {
    me(parent, args, context) {
      if (context.user) {
        return User.findById(context.user._id);
      } else {
        throw new AuthenticationError('Not logged in');
      }
    },
  },
  Mutation: {
    async createUser(parent, { username, email, password }) {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    async login(parent, { email, password }) {
      const user = await User.findOne({ email });
      if (!user) throw new AuthenticationError('Bad credentials');
      const isCorrectPassword = await user.isCorrectPassword(password);
      if (!isCorrectPassword) throw new AuthenticationError('Bad credentials');
      const token = signToken(user);
      return { token, user };
    },
    addBook(parent, { book }, context) {
      if (!context.user) throw new AuthenticationError('Not logged in');
      return User.findByIdAndUpdate(
        context.user._id,
        { $addToSet: { savedBooks: book } },
        { new: true, runValidators: true }
      );
    },
    removeBook(parent, { bookId }, context) {
      if (!context.user) throw new AuthenticationError('Not logged in');
      return User.findByIdAndUpdate(
        context.user._id,
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );
    },
  },
};
