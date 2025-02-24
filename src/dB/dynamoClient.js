import { DynamoDB } from 'aws-sdk';

// Konfigurera DynamoDB-klienten
const dynamoDb = new DynamoDB.DocumentClient({
    region: 'eu-north-1', // Ändra till rätt region
});

export default dynamoDb;
