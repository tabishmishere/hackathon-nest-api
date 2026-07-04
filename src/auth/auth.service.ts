import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from './interfaces/user.interface';

@Injectable()
export class AuthService {
  private users: User[] = [];

  constructor(private readonly jwtService: JwtService) {}

  async register(registerDto: RegisterDto): Promise<Omit<User, 'passwordHash'>> {
    const { email, password, name, role } = registerDto;

    const existingUser = this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser: User = {
      id: randomUUID(),
      email: email.toLowerCase(),
      passwordHash,
      name,
      role,
    };

    this.users.push(newUser);

    // Return user object without the password hash
    const { passwordHash: _, ...result } = newUser;
    return result;
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string; user: Omit<User, 'passwordHash'> }> {
    const { email, password } = loginDto;

    const user = this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const { passwordHash: _, ...userWithoutPassword } = user;

    return {
      access_token: this.jwtService.sign(payload),
      user: userWithoutPassword,
    };
  }
}
