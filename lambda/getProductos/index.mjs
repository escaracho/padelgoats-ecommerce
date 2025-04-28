import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const dynamoClient = new DynamoDBClient({ region: process.env.CUSTOM_AWS_REGION });

export const handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));
  console.log('Environment:', {
    region: process.env.CUSTOM_AWS_REGION,
    tableName: process.env.PRODUCTS_TABLE_NAME
  });

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
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
    // Scan DynamoDB table
    const params = {
      TableName: process.env.PRODUCTS_TABLE_NAME
    };

    console.log('DynamoDB params:', params);
    const command = new ScanCommand(params);
    
    console.log('Executing DynamoDB scan...');
    const { Items } = await dynamoClient.send(command);
    console.log('DynamoDB response received, items count:', Items?.length);
    
    if (!Items) {
      console.log('No items returned from DynamoDB');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify([])
      };
    }

    const products = Items.map(item => unmarshall(item));
    console.log('Products processed successfully');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(products)
    };
  } catch (error) {
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      requestId: error.$metadata?.requestId,
      stack: error.stack
    });

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        message: "Internal server error",
        details: error.message,
        code: error.code
      })
    };
  }
}; 