const { Query } = require('./Query');
const { auth } = require('./Mutation/auth');
const { AuthPayload } = require('./AuthPayload');
const { stack } = require('./Mutation/stack');

module.exports = {
  Query,
  Mutation: {
    ...auth,
    ...stack
  },
  AuthPayload
};
