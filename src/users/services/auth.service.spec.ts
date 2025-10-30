import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ConfigService } from '../../config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
    const token = 'test-token-value'
    const payload = {
        token: token,
        user: {
          id: 1,
          name: 'piotr',
          email: 'piotr@myflow.pl',
          password: 'dsfdsf',
      }
    };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService, 
        {
          provide: JwtService,
          useValue: {
            async signAsync() {
                return token;
            },
            async verifyAsync(t) {
                if(t === token) {
                    return payload;
                }
                return null;
            }
          }
        },
        {
          provide: UsersService,
          useValue: {
            async findOneBy() { return payload.user }
          }
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('token generation', async () => {
    
    const token = await service.encodeUserToken(payload.user);
    expect(typeof token).toBe('string');
    await expect(service.decodeUserToken(token)).resolves.toMatchObject(payload);
  });
});
