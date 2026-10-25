import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { NotFoundException } from '@nestjs/common';


@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

    async remove(id: string) {
      const user = await this.prisma.users.findUnique({
        where: { id },
      })
      if (!user) {
        throw new NotFoundException('User not found');
      }

      return this.prisma.users.delete({
        where: { id },
      });
    }

  async getAllUsers() {
      return this.prisma.users.findMany(); 
    }

  
  async findOne(username: string) {
      return this.prisma.users.findUnique({
        where: {username},
      })
  }

  async create(user: { username: string; password: string }) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    return this.prisma.users.create ({
      data:{
      username : user.username,
      password : hashedPassword,
      role : 'user', 
    },
    });
  }
  async createadmin(user: { username: string; password: string }) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    return this.prisma.users.create ({
      data:{
      username : user.username,
      password : hashedPassword,
      role : 'admin', 
    },
    });
  }

}
