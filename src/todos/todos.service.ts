import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class TodosService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createTodoDto: CreateTodoDto, userId: string) {
    const { title, content } = createTodoDto;
    await this.prismaService.todo.create({ data: { title, content, userId } });
    return { data: 'Todo created' };
  }

  async findAll(userId: string) {
    const todos = await this.prismaService.todo.findMany({
      where: { userId },
      include: { user: { select: { email: true, username: true } } },
    });
    return todos;
  }

  findOne(id: number) {
    return `This action returns a #${id} todo`;
  }

  update(id: number, updateTodoDto: UpdateTodoDto) {
    return `This action updates a #${id} todo`;
  }

  async remove(todoId: string, userId: string) {
    const todo = await this.prismaService.todo.findUnique({
      where: { todoId: todoId },
    });
    if (!todo) throw new NotFoundException('Todo not found');
    if (todo.userId !== userId) throw new ForbiddenException('Forbidden');

    await this.prismaService.todo.delete({ where: { todoId: todoId } });
    return { data: 'Todo deleted' };
  }
}
