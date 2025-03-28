import { NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const prisma = new PrismaClient();
  const id = params.id;

  const data = await prisma.constituent.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  return NextResponse.json(data);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const prisma = new PrismaClient();
  const id = params.id;

  const body = await request.json();

  const data = await prisma.constituent.update({
    where: {
      id: parseInt(id),
    },
    data: {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      address: body.address,
      city: body.city,
      state: body.state,
      zip: body.zip,
      phone: body.phone,
    },
  });

  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const prisma = new PrismaClient();
  const id = params.id;

  const data = await prisma.constituent.delete({
    where: {
      id: parseInt(id),
    },
  });

  return NextResponse.json(data);
}