import { TestingModule, Test } from "@nestjs/testing";
import * as request from 'supertest';
import { AppModule } from "../src/app.module";
import { AuthRegisterDto } from "../src/users/dto/auth.dto";
import { User } from "../generated/prisma/client";
import { UsersService } from "../src/users/services/users.service";
import { INestApplication } from "@nestjs/common";
import { AuthService } from "../src/users/services/auth.service";

describe('AuthController (e2e) - register', () => {
  let app: INestApplication;
  let authService: AuthService;

  let usersService: Partial<Record<keyof UsersService, jest.Mock>>;

  beforeEach(async () => {

    usersService = {
      findOneBy: jest.fn().mockResolvedValue(null), // simulate user not exists
      createUser: jest.fn().mockImplementation(async (dto) => {
        return Promise.resolve({ id: 1, ...dto } as User);
      }
        
      ),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(UsersService)
      .useValue(usersService)
    //   .useMocker((token) => {
        
    //     if (token === UsersService) {
    //       return usersService;
    //     }
    //   })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    authService = app.get(AuthService);
  });

  afterEach(async () => {
    await app.close();
  });

  it('should register a new user', async () => {
    const req: AuthRegisterDto = {
      name: 'Piotr',
      email: 'piotr@example.com',
      password: '!@#$',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(req)
      .expect(201);

    expect(response.body).toMatchObject({
      id: expect.any(Number),
      name: req.name,
      email: req.email,
    });

    // Ensure our mock service was called correctly
    expect(usersService.findOneBy).toHaveBeenCalledWith({ email: req.email });

    // const password = await authService.encodePassword(req.password);
    expect(usersService.createUser).toHaveBeenCalledWith({
        ...req, 
        password: expect.any(String)
    });
  });

  it('should throw validation', async () => {
    const req: AuthRegisterDto = {
      name: 'Pr',
      email: 'piotrexample.com',
      password: '!@',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(req)
      .expect(400);

    expect(response.body).toMatchObject({
      "error": "Bad Request",
       "message": [
         "name must be longer than or equal to 3 characters",
         "email must be an email",
         "Password has to be equal or grater then 4 characters",
       ],
       "statusCode": 400,
    });

  });
});


// describe('UserController (e2e)', () => {
//   let app;

//   const mockUsers = {
//     findOneBy: (d) => {
//         console.log('find one', d)
//     },
//     createUser: () => {

//     }
//   };

//   beforeEach(async () => {



//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       imports: [AppModule],
//     })
//     .overrideProvider(UsersService)
//     .useValue(mockUsers)
//     .compile();

//     app = moduleFixture.createNestApplication();
//     await app.init();
//   });

//   it('/auth/register (POST)', () => {

//     const req: AuthRegisterDto = {
//       name: 'piotr',
//       email: 'piotr4@myflow.pl',
//       password: '!@#$',
//     };

//     const res: Partial<User> = {
//         id: expect.any(Number),
//         name: 'piotr',
//         email: 'piotr@myflow.pl',
//     };

//     return request(app.getHttpServer())
//       .post('/auth/register')
//       .send(req)
//       .expect(201)
//       .then(r => {
//         expect(r.body).toMatchObject(res);
//       });
//   });

// });