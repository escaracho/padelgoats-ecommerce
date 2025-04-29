import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const dynamoClient = new DynamoDBClient({ region: process.env.CUSTOM_AWS_REGION });

export const handler = async (event) => {
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,OPTIONS"
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const productId = event.pathParameters?.id;
    if (!productId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Product ID is required' })
      };
    }

    const params = {
      TableName: process.env.PRODUCTS_TABLE_NAME,
      Key: {
        ProductoID: { S: productId }
      }
    };

    console.log('Fetching product with params:', params);
    const command = new GetItemCommand(params);
    const response = await dynamoClient.send(command);

    if (!response.Item) {
      console.log('Product not found for ID:', productId);
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ message: 'Product not found' })
      };
    }

    const product = unmarshall(response.Item);
    console.log('Product found:', product);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(product)
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Internal server error' })
    };
  }
}; 