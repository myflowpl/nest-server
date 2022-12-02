import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { AuthLoginDto, AuthLoginResponse } from '../src/users/dto/auth.dto/auth.dto';
import { User } from '../src/users/entities/user.entity/user.entity';

describe('AppController (e2e)', () => {

  let app: INestApplication;

  beforeEach(async () => {

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello from Nest !!');
  });
  
  it('/auth/login (GET)', () => {

    const req: AuthLoginDto = {
      email: 'piotr@myflow.pl',
      password: '!@#$',
    }

    const resBody: AuthLoginResponse = {
      token: expect.any(String),
      user: {
        id: expect.any(Number),
        email: req.email,
        name: 'Piotr',
        password: expect.any(String),
        roles: expect.any(Array)
      },
    }

    return request(app.getHttpServer())
      .post('/auth/login')
      .send(req)
      .expect(201)
      .then(res => {
        expect(res.body).toMatchObject(resBody);
      });
  });

  it('/auth (GET)', () => {

    const resBody: User = {
      id: expect.any(Number),
      email: 'piotr@myflow.pl',
      name: 'Piotr',
      password: expect.any(String),
      roles: expect.any(Array)
    }
    
    return request(app.getHttpServer())
      .get('/auth')
      .expect(200)
      .then(res => {
        expect(res.body).toMatchObject(resBody);
      });
  })


});
