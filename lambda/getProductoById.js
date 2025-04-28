import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDB({});
const dynamodb = DynamoDBDocument.from(client);
const tableName = process.env.DYNAMODB_TABLE_NAME;

export const handler = async (event) => {
  const productoId = event.pathParameters.id;
  
  try {
    const params = {
      TableName: tableName,
      Key: {
        ProductoID: productoId
      }
    };
    
    const { Item } = await dynamodb.get(params);
    
    if (!Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Producto no encontrado' })
      };
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(Item)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}; 