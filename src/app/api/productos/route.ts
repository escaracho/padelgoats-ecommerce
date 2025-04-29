import { NextResponse } from 'next/server';
import AWS from 'aws-sdk';

// Configure AWS
const awsConfig = {
  region: process.env.AWS_REGION || 'us-east-1',
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

export async function GET() {
  try {
    console.log('Fetching products from DynamoDB...');
    const params = {
      TableName: TABLE_NAME
    };

    const result = await dynamodb.scan(params).promise();
    console.log('DynamoDB result:', result);
    
    if (!result.Items) {
      return NextResponse.json([]);
    }

    return NextResponse.json(result.Items);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const product = await request.json();
    const productId = Date.now().toString();

    const params = {
      TableName: TABLE_NAME,
      Item: {
        ProductoID: productId,
        ...product,
        estado: product.estado || 'activo'
      }
    };

    await dynamodb.put(params).promise();
    return NextResponse.json(params.Item);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const updates = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const params = {
      TableName: TABLE_NAME,
      Key: {
        ProductoID: id
      },
      UpdateExpression: 'set #n = :n, descripcion = :d, precio = :p, stock = :s, categoria = :c, marca = :m, estado = :e, imageUrl = :i',
      ExpressionAttributeNames: {
        '#n': 'nombre'
      },
      ExpressionAttributeValues: {
        ':n': updates.nombre,
        ':d': updates.descripcion,
        ':p': updates.precio,
        ':s': updates.stock,
        ':c': updates.categoria,
        ':m': updates.marca,
        ':e': updates.estado,
        ':i': updates.imageUrl
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

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const params = {
      TableName: TABLE_NAME,
      Key: {
        ProductoID: id
      }
    };

    await dynamodb.delete(params).promise();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
} 