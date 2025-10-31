// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this.usersService.findOne(username);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...safe } = user;
      return safe;
    }
    return null;
  }

  async login(user: any) {
    const payload = { sub: user.id, username: user.username, role: user.role};
    const access_token= this.jwtService.sign(payload);
    return {
      access_token
    };
  }
}
