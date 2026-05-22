import { NextResponse } from 'next/server';

export async function PUT() {
  return NextResponse.json(
    { error: 'Content is managed via TypeScript source files. Edit src/data/course/ and run npm run seed-content.' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Content is managed via TypeScript source files. Edit src/data/course/ and run npm run seed-content.' },
    { status: 405 }
  );
}
