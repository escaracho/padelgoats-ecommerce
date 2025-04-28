const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const productoId = event.pathParameters.id;
  
  try {
    const params = {
      TableName: 'padelgoats_productos',
      Key: {
        ProductoID: productoId
      }
    };
    
    const { Item } = await dynamodb.get(params).promise();
    
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
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}; 