import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findByUsername(username);
    const isMatch = await bcrypt.compare(pass, user.password);
    if (user && isMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  guestLogin() {
    const payload = {
      username: 'guest',
      role: 'guest',
      sub: 'guest'
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  login(user: any) {
    const payload = {
      username: user._doc.username,
      sub: user._doc._id,
      role: user._doc.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
