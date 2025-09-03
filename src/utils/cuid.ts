import { PrismaClient } from 'generated/prisma';
import cuid from 'cuid';

export default class CuidGenerator extends PrismaClient {
  async generate() {
    await this.$connect();

    // Example: Generate a UID for a new user
    const uid = cuid();
    console.log(`Generated UID: ${uid}`);

    await this.$disconnect();
  }
}