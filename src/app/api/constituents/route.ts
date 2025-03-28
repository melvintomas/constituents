import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export async function GET(request: Request) {
  const url = new URL(request.url);

  // Parse query parameters
  const start = parseInt(url.searchParams.get("start") ?? "0", 10);
  const size = parseInt(url.searchParams.get("size") ?? "10", 10);
  const filters = JSON.parse(url.searchParams.get("filters") ?? "[]");
  const globalFilter = url.searchParams.get("globalFilter") ?? "";
  const sorting = JSON.parse(url.searchParams.get("sorting") ?? "[]");

  const prisma = new PrismaClient();
  let data = await prisma.constituent.findMany({
    skip: start,
    take: size,
    where: {
      AND: filters.map((filter: { id: string; value: string }) => ({
        [filter.id]: {
          contains: filter.value,
        },
      })),
      OR: [
        {
          firstName: {
            contains: globalFilter,
          },
        },
        {
          lastName: {
            contains: globalFilter,
          },
        },
        {
          address: {
            contains: globalFilter,
          },
        },
        {
          city: {
            contains: globalFilter,
          },
        },
        {
          zip: {
            contains: globalFilter,
          },
        },
        {
          state: {
            contains: globalFilter,
          },
        },
        {
          phone: {
            contains: globalFilter,
          },
        },
      ],
    },
    orderBy: sorting.map((sort: { id: string; desc: boolean }) => ({
      [sort.id]: sort.desc ? "desc" : "asc",
    })),
  });

  return NextResponse.json({
    data,
    meta: {
      totalRowCount: data.length
    },
  });
}


export async function POST(req: NextRequest) {
  const prisma = new PrismaClient();
  const body = await req.json();
  try {
    const data = await prisma.constituent.create({
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

    return NextResponse.json(data, { status: 201 }); // Return 201 Created
  } catch (error: any) {

    if (error.code === "P2002" && error.meta.target.includes("email")) {
      // Find the existing record with the same email
      const existingRecord = await prisma.constituent.findUnique({
        where: {
          email: body.email
        },
      });


      return NextResponse.json(
        {
          error: "A record with this email already exists.",
          existingConstituent: existingRecord,
        },
        { status: 409 }
      );
    }
  }


  return NextResponse.json(
    { error: "An error occurred while creating the record." },
    { status: 500 }
  );
}
