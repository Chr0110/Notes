import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { Module, Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

@Controller()
class AuthController {
  @MessagePattern({ cmd: 'register' })
  async register(data: { username: string; password: string }) {
    try {
      // console.log(data.username)
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const user = await prisma.users.create({
      data: {
      username: data.username,
      password: hashedPassword,
      role: 'user',
      },
      });
      return { success: true, userId: user.id, username: user.username };
    } 
    catch (error)
    {
      console.log(error)
      return { success: false, error: 'User already exists' };
    }
  }

  @MessagePattern({ cmd: 'register_admin' })
  async registerAdmin(data: { username: string; password: string }) {
    try {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const user = await prisma.users.create({
        data: {
          username: data.username,
          password: hashedPassword,
          role: 'admin',
        },
      });
      return { success: true, userId: user.id, username: user.username };
    } catch (error) {
      return { success: false, error: 'User already exists' };
    }
  }

  @MessagePattern({ cmd: 'login' })
  async login(data: { username: string; password: string }) {
    // console.log(data.username)
    const user = await prisma.users.findUnique({
      where: { username: data.username },
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    const isValid = await bcrypt.compare(data.password, user.password);
    if (!isValid) {
      return { success: false, error: 'Invalid password' };
    }

    const payload = { 
      sub: user.id, 
      username: user.username, 
      role: user.role 
    };
    const access_token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

    return { 
      success: true, 
      access_token,
      userId: user.id,
      username: user.username,
      role: user.role
    };
  }

  @MessagePattern({ cmd: 'validate' })
  async validateToken(data: { token: string }) {
    try {
      const decoded = jwt.verify(data.token, JWT_SECRET) as any;
      return { 
        success: true, 
        user: {
          userId: decoded.sub,
          username: decoded.username,
          role: decoded.role
        }
      };
    } catch (error) {
      return { success: false, error: 'Invalid token' };
    }
  }

  @MessagePattern({ cmd: 'find_user' })
  async findUser(data: { username: string }) {
    const user = await prisma.users.findUnique({
      where: { username: data.username },
      select: {
        id: true,
        username: true,
        role: true,
      }
    });
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    return { success: true, user };
  }

  @MessagePattern({ cmd: 'get_all_users' })
  async getAllUsers() {
    const users = await prisma.users.findMany({
      select: {
        id: true,
        username: true,
        role: true,
      }
    });
    return { success: true, users };
  }

  @MessagePattern({ cmd: 'delete_user' })
  async deleteUser(data: { id: string }) {
    try {
      const user = await prisma.users.findUnique({
        where: { id: data.id },
      });

      if (!user) {
        return { success: false, error: 'User not found' };
      }

      await prisma.users.delete({
        where: { id: data.id },
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

@Module({
  controllers: [AuthController],
})
class AuthModule {}

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    {
      transport: Transport.TCP,
      options: { host: 'localhost', port: 3001 },
    },
  );
  await app.listen();
  console.log('Auth Microservice running on port 3001');
}
bootstrap();