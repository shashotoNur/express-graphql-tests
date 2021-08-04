require('dotenv').config({ path: __dirname + '/../src/config/config.env' });

const { connection } = require('mongoose');
const supertest = require("supertest");

const app = require("../src/config/app");
const connectToDatabase = require('../src/config/db');
 
const request = supertest(app);

const loginUserQuery = `
    query LoginUserQuery($email: String, $password: String, $tokenId: String){
        loginUserQuery(email: $email, password: $password, tokenId: $tokenId) {
            token
            status
        }
    }
`;

const createUserMutation = `
    mutation CreateUserMutation($name: String, $email: String, $password: String, $tokenId: String) {
        createUserMutation(name: $name, email: $email, password: $password, tokenId: $tokenId) {
            token
            status
        }
    }
`;

const deleteUserMutation = `
    mutation DeleteUserMutation {
        deleteUserMutation {
            status
        }
    }
`;

const newUser =
{
    name: 'Bob',
    email: 'bob@mail.com',
    password: 'bob"s password'
};

afterAll(() => connection.close() );

it('should connect to database',
    async () => { await connectToDatabase(); }, 15000
);

it("should create a new user",
    async () =>
    {
        const response = await request.post('/server')
            .set('content-type', 'application/json')
            .send(
                {
                    'query' : createUserMutation,
                    'variables' : {
                        'name': newUser.name,
                        'email': newUser.email,
                        'password': newUser.password
                    }
                }
            );
        
        const text = JSON.parse(response.text);
        const { token, status } = text.data.createUserMutation;

        expect(token).not.toBeNull();
        expect(status).toEqual('SignUp successful!');
    }
);

it("login a pre-existing user and delete them",
    async () =>
    {
        const response = await request.post('/server')
            .set('content-type', 'application/json')
            .send(
                {
                    'query' : loginUserQuery,
                    'variables' : {
                        'email': newUser.email,
                        'password': newUser.password
                    }
                }
            );
        
        const text = JSON.parse(response.text);
        const { token, status } = text.data.loginUserQuery;

        expect(token).not.toBeNull();
        expect(status).toEqual('Login successful!');


        const headers = { "token": token };
        const deleteResponse = await request.post('/server')
            .set('content-type', 'application/json')
            .set(headers)
            .send( { 'query' : deleteUserMutation } );

        const txt = JSON.parse(deleteResponse.text);
        const { status: deleteStatus } = txt.data.deleteUserMutation;

        expect(deleteStatus).toEqual('User deleted successfully!');
    }
);