import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import * as pactum from "pactum";
import { AuthDto } from 'src/auth/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  // imports all modules, as you need all modules for testing
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true }),
    );

    await app.listen(4001);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://127.0.0.1:4001');
  });

  afterAll(async () => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = { email: "armaan@guppy3.im", password: "123456" };
    
    describe('Signup', () => {
      it("should throw if email empty", () => {
        return pactum.spec().post('/auth/signup').withBody({ password: dto.password }).expectStatus(400);
      });

      it("should throw error if email is already in use", () => {
        const _dto: AuthDto = {
          email: "armaan@guppyXXX.im",
          password: "123456"
        };

        pactum.spec().post('/auth/signup').withBody(_dto).expectStatus(201);
        return pactum.spec().post('/auth/signup').withBody(_dto).expectStatus(403).inspect();
      }); 

      it("should signup", () => {
        return pactum.spec().post('/auth/signup').withBody(dto).expectStatus(201);
      });
    });

    describe('Signin', () => {
      it("should signin", () => {
        return pactum.spec().post('/auth/signin').withBody(dto).expectStatus(201);
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {});
    describe('Edit user', () => {});
  });

  describe('Bookmark', () => {
    describe('Create bookmark', () => {});
    describe('Edit bookmark', () => {});
    describe('Delete bookmark', () => {});
    describe('Get bookmarks', () => {});
    describe('Get bookmark by id', () => {});
  });
})