import { DynamoDB } from 'aws-sdk';

// Konfigurera DynamoDB-klienten
const dynamoDb = new DynamoDB.DocumentClient({
  region: 'eu-north-1',
});

// Funktion för att uppdatera Stripe ID för en användare
const updateUserStripeId = async (userId, stripeUserId) => {
  const params = {
    TableName: 'User', 
    Key: { userId },
    UpdateExpression: 'set stripeUserId = :stripeUserId',
    ExpressionAttributeValues: {
      ':stripeUserId': stripeUserId,
    },
  };
  return dynamoDb.update(params).promise();
};

// Funktion för att uppdatera användarstatus
const updateUserStatus = async (userId, status) => {
  const params = {
    TableName: 'User',
    Key: { userId },
    UpdateExpression: 'set userStatus = :status',
    ExpressionAttributeValues: {
      ':status': status,
    },
  };
  return dynamoDb.update(params).promise();
};

export { dynamoDb, updateUserStripeId, updateUserStatus };
