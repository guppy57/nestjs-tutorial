import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { url } from 'inspector';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor() {
        super({
            datasources: {
                db: {
                    url: "postgresql://doadmin:AVNS_K-zxuilUsGL7Toyf7AY@db-cluster-1-do-user-12991085-0.b.db.ondigitalocean.com:25060/defaultdb?sslmode=require"
                }
            }
        });
    }
}
