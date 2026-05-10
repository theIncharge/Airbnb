import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "./generated/prisma/client";


const adapter = new PrismaMariaDb({
  host: "localhost",
  user: "root",
  password: "ADITYA21",
  database: "airbnb_booking_dev",
  port:3307
});
// export default new PrismaClient({adapter})
const prisma = new PrismaClient({ adapter });
export { prisma };