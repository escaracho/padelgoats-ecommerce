import { NextResponse } from 'next/server';
import AWS from 'aws-sdk';

// Configure AWS
const awsConfig = {
  region: process.env.NEXT_PUBLIC_AWS_REGION || 'sa-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
};

// Set AWS config
AWS.config.update(awsConfig);

// Create DynamoDB service object
const dynamodb = new AWS.DynamoDB.DocumentClient(awsConfig);

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'padelgoats_productos';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    console.log('Deleting product with ID:', id);
    console.log('Using table:', TABLE_NAME);
    console.log('AWS Config:', {
      region: awsConfig.region,
      hasCredentials: !!awsConfig.credentials.accessKeyId && !!awsConfig.credentials.secretAccessKey
    });

    const deleteParams = {
      TableName: TABLE_NAME,
      Key: {
        ProductoID: id
      }
    };

    console.log('Delete params:', deleteParams);
    await dynamodb.delete(deleteParams).promise();
    console.log('Product deleted successfully');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      requestId: error.requestId
    });
    return NextResponse.json(
      { error: `Failed to delete product: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    const dynamoParams = {
      TableName: TABLE_NAME,
      Key: {
        ProductoID: id
      }
    };

    const result = await dynamodb.get(dynamoParams).promise();
    
    if (!result.Item) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.Item);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const updates = await request.json();

    console.log('PUT request for product ID:', id);
    console.log('Raw update payload:', updates);

    // List of allowed fields and their DynamoDB attribute names
    const allowedFields = [
      { key: 'Nombre', attr: '#n', value: ':n' },
      { key: 'Descripcion', attr: 'Descripcion', value: ':d' },
      { key: 'Precio', attr: 'Precio', value: ':p' },
      { key: 'Stock', attr: 'Stock', value: ':s' },
      { key: 'Categoria', attr: 'Categoria', value: ':c' },
      { key: 'Marca', attr: 'Marca', value: ':m' },
      { key: 'ImagenURL', attr: 'ImagenURL', value: ':i' },
      { key: 'ImagenHoverURL', attr: 'ImagenHoverURL', value: ':h' },
      { key: 'Forma', attr: 'Forma', value: ':f' }
    ];

    let updateExprParts = [];
    let exprAttrNames = {};
    let exprAttrValues = {};

    for (const field of allowedFields) {
      if (updates[field.key] !== undefined && updates[field.key] !== null) {
        updateExprParts.push(`${field.attr} = ${field.value}`);
        if (field.key === 'Nombre') {
          exprAttrNames['#n'] = 'Nombre';
        }
        exprAttrValues[field.value] = updates[field.key];
      }
    }

    if (updateExprParts.length === 0) {
      console.log('No valid fields provided for update.');
      return NextResponse.json(
        { error: 'No valid fields provided for update.' },
        { status: 400 }
      );
    }

    const dynamoParams = {
      TableName: TABLE_NAME,
      Key: {
        ProductoID: id
      },
      UpdateExpression: 'set ' + updateExprParts.join(', '),
      ExpressionAttributeNames: Object.keys(exprAttrNames).length > 0 ? exprAttrNames : undefined,
      ExpressionAttributeValues: exprAttrValues,
      ReturnValues: 'ALL_NEW'
    };

    console.log('DynamoDB update params:', JSON.stringify(dynamoParams, null, 2));

    const result = await dynamodb.update(dynamoParams).promise();
    console.log('DynamoDB update result:', result);
    return NextResponse.json(result.Attributes);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
} 