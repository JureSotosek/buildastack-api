const {
  makeExecutableSchema,
  makeRemoteExecutableSchema,
  delegateToSchema
} = require('graphql-tools');
const { HttpLink } = require('apollo-link-http');
const fetch = require('node-fetch');

const suggestionsSchemaString = `
type Query {
  suggestions(
    dependencies: [String]
    devDependencies: [String]
    limit: Int
  ): suggestionsPayload!
}

type suggestionsPayload {
  dependencies: [Package!]!
  devDependencies: [Package!]!
  allDependencies: [Package!]!
}

type Package {
  name: String!
  version: String!
  description: String
  owner: Owner!
  humanDownloadsLast30Days: String!
  objectID: String!
  popular: Boolean!
}

type Owner {
  name: String!
}
`;

const introscpectionSchema = makeExecutableSchema({
  typeDefs: suggestionsSchemaString
});

const link = new HttpLink({ uri: 'https://npm-suggestions.now.sh/', fetch });

const schema = makeRemoteExecutableSchema({
  schema: introscpectionSchema,
  link
});

function suggestions(args, ctx, info) {
  return delegateToSchema(schema, {}, 'query', 'suggestions', args, ctx, info);
}

module.exports = { suggestions };
