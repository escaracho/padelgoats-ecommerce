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

const realProducts = [
  {
    ProductoID: "nox-ml10-quantum-3k-2025-by-miguel-lamperti",
    Categoria: "Paletas",
    Descripcion: "Descubre la pala NOX ML10 Quantum 3K, ligera y potente. Con marco de carbono y núcleo HR3, ¡mejora tu juego y controla cada golpe! Compra ahora.",
    ImagenHoverURL: "https://padelgoats-images.s3.sa-east-1.amazonaws.com/Fotos+de+paletas/NOX/NOX+ML10+QUANTUM+3K+2025+by+MIGUEL+LAMPERTI2.webp",
    ImagenURL: "https://padelgoats-images.s3.sa-east-1.amazonaws.com/Fotos+de+paletas/NOX/NOX+ML10+QUANTUM+3K+2025+by+MIGUEL+LAMPERTI.webp",
    Marca: "Nox",
    Nombre: "NOX ML10 QUANTUM 3K 2025 by MIGUEL LAMPERTI",
    Precio: 491000,
    Stock: 1,
    Estado: "activo"
  },
  {
    ProductoID: "adidas-adipower-ctrl-3-3-2024",
    Categoria: "Paletas",
    Descripcion: "Descubre la Adidas ADIPOWER CTRL 3.3 2024, la pala ideal para jugadores avanzados que buscan precisión y potencia en cada golpe. ¡Compra ahora!",
    ImagenHoverURL: "https://padelgoats-images.s3.sa-east-1.amazonaws.com/Fotos+de+paletas/ADIDAS/Adidas+ADIPOWER+CTRL+3.3+20242.webp",
    ImagenURL: "https://padelgoats-images.s3.sa-east-1.amazonaws.com/Fotos+de+paletas/ADIDAS/Adidas+ADIPOWER+CTRL+3.3+2024.webp",
    Marca: "Adidas",
    Nombre: "Adidas ADIPOWER CTRL 3.3 2024",
    Precio: 351999,
    Stock: 1,
    Estado: "activo"
  },
  {
    ProductoID: "adidas-adipower-control-multiweight-pro-2024-alex-ruiz",
    Categoria: "Paletas",
    Descripcion: "Potencia y control en tus manos. Descubre la pala ADIDAS Adipower CTRL Multiweight 2024, diseñada para elevar tu juego. ¡Hazla tuya ahora!",
    ImagenHoverURL: "https://padelgoats-images.s3.sa-east-1.amazonaws.com/Fotos+de+paletas/ADIDAS/ADIDAS+ADIPOWER+Control+Multiweight+PRO+2024+Alex+Ruiz2.webp",
    ImagenURL: "https://padelgoats-images.s3.sa-east-1.amazonaws.com/Fotos+de+paletas/ADIDAS/ADIDAS+ADIPOWER+Control+Multiweight+PRO+2024+Alex+Ruiz.webp",
    Marca: "Adidas",
    Nombre: "ADIDAS ADIPOWER Control Multiweight PRO 2024 Alex Ruiz",
    Precio: 589000,
    Stock: 1,
    Estado: "activo"
  }
  // Adding just a few products for testing, you can add the rest similarly
];

export async function GET() {
  try {
    console.log('Seeding real product data...');

    // Add products
    for (const product of realProducts) {
      const params = {
        TableName: TABLE_NAME,
        Item: product
      };

      await dynamodb.put(params).promise();
    }

    return NextResponse.json({ message: 'Test data seeded successfully' });
  } catch (error) {
    console.error('Error seeding test data:', error);
    return NextResponse.json(
      { error: 'Failed to seed test data' },
      { status: 500 }
    );
  }
} 