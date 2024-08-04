import { Client, Account, ID, Databases, Storage, Query } from "appwrite";

const client = new Client()
    .setEndpoint('http://localhost/v1') // Your API Endpoint
    .setProject('66adc55d001f17e12b75');                 // Your project ID

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

export {account, client, ID, databases, storage, Query};