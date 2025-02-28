import { Injectable } from '@otdrfu/cute-nestjs'
import type { CreateUserDto } from './dto/create-user.dto'
import type { User } from './interfaces/user.interface'

@Injectable()
export class UserService {
  private users: User[] = [
    {
      id: 1,
      username: 'drfu',
      email: 'drfu@cute-nestjs.com',
      password: '123456',
      createdAt: new Date()
    },
    
  ]

  async findById(id: number): Promise<User | undefined> {
    return this.users.find(user => user.id === id)
  }

  async create(data: CreateUserDto): Promise<User> {
    const user: User = {
      id: this.users.length + 1,
      ...data,
      createdAt: new Date()
    }
    this.users.push(user)
    return user
  }
} 