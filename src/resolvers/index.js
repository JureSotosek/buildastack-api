const { Query } = require('./Query');
const { AuthPayload } = require('./AuthPayload');
const { stack } = require('./Mutation/stack');

module.exports = {
  Query,
  Mutation: {
    ...stack
  },
  AuthPayload
};
