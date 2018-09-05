const { Query } = require('./Query');
const { AuthPayload } = require('./AuthPayload');
const { StackPayload } = require('./StackPayload');
const { stack } = require('./Mutation/stack');
const { auth } = require('./Mutation/auth');

module.exports = {
  Query,
  Mutation: {
    ...stack,
    ...auth
  },
  AuthPayload,
  StackPayload
};
