const { GraphQLObjectType, GraphQLString } = require('graphql');

const { loginUser, createUser, deleteUser } = require('../resolvers/userResolver/userResolver');


// Return types
const UserType = new GraphQLObjectType(
    {
        name: 'UserType',
        fields: () => ({
            name: { type: GraphQLString },
            token: { type: GraphQLString },
            status: { type: GraphQLString }
        })
    });

// Queries and Mutations
const loginUserQuery = {
    type: UserType,
    args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        tokenId: { type: GraphQLString }
    },
    resolve(_parent, args) { return loginUser(args); }
};

const createUserMutation = {
    type: UserType,
    args:
    {
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        tokenId: { type: GraphQLString }
    },
    resolve(_parent, args) { return createUser(args); }
};

const deleteUserMutation = {
    type: UserType,
    resolve(_parent, _args, context) { return deleteUser(context); }
};

module.exports = { loginUserQuery, createUserMutation, deleteUserMutation };