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
    
    const params = {
      TableName: TABLE_NAME,
      Key: {
        ProductoID: id
      }
    };

    const result = await dynamodb.get(params).promise();
    
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

    const params = {
      TableName: TABLE_NAME,
      Key: {
        ProductoID: id
      },
      UpdateExpression: 'set #n = :n, Descripcion = :d, Precio = :p, Stock = :s, Categoria = :c, Marca = :m, ImagenURL = :i, ImagenHoverURL = :h',
      ExpressionAttributeNames: {
        '#n': 'Nombre'
      },
      ExpressionAttributeValues: {
        ':n': updates.Nombre,
        ':d': updates.Descripcion,
        ':p': updates.Precio,
        ':s': updates.Stock,
        ':c': updates.Categoria,
        ':m': updates.Marca,
        ':i': updates.ImagenURL,
        ':h': updates.ImagenHoverURL
      },
      ReturnValues: 'ALL_NEW'
    };

    const result = await dynamodb.update(params).promise();
    return NextResponse.json(result.Attributes);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
} 