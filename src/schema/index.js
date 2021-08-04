const { GraphQLObjectType, GraphQLSchema } = require('graphql');

const { loginUserQuery, createUserMutation, deleteUserMutation } = require('./userSchema')

// Reading data inside database
const QueryType = new GraphQLObjectType(
    {
        name: 'QueryType',
        fields:
        {
            loginUserQuery
        }
    });

// Changing data inside database
const MutationType = new GraphQLObjectType(
    {
        name: 'MutationType',
        fields:
        {
            createUserMutation,
            deleteUserMutation
        }
    });

module.exports = new GraphQLSchema({
    query: QueryType,
    mutation: MutationType
});