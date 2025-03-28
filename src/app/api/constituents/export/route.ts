import { NextResponse } from "next/server";
import { json2csv } from 'json-2-csv';
import { PrismaClient } from "@prisma/client";

export async function GET() {
  const prisma = new PrismaClient();
  const constituents = await prisma.constituent.findMany();

  const csv = await json2csv(constituents);

  const response = new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename=constituents.csv`,
    },
  });
  return response;
}