const { Client, Databases, Users } = require('node-appwrite');

const client = new Client();

client
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const users = new Users(client);

module.exports = {
    client,
    databases,
    users,
    DATABASE_ID: process.env.APPWRITE_DATABASE_ID,
    CAKES_COLLECTION_ID: process.env.APPWRITE_CAKES_COLLECTION_ID,
    CART_COLLECTION_ID: process.env.APPWRITE_CART_COLLECTION_ID,
    ORDERS_COLLECTION_ID: process.env.APPWRITE_ORDERS_COLLECTION_ID,
    USERS_COLLECTION_ID: process.env.APPWRITE_USERS_COLLECTION_ID,
};
