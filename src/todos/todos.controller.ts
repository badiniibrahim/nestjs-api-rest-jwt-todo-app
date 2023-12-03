import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  create(@Body() createTodoDto: CreateTodoDto, @Req() request: Request) {
    const userId = request.user['userId'];
    return this.todosService.create(createTodoDto, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(@Req() request: Request) {
    const userId = request.user['userId'];
    return this.todosService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todosService.update(+id, updateTodoDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('delete/:id')
  remove(@Param('id') todoId: string, @Req() request: Request) {
    const userId = request.user['userId'];

    return this.todosService.remove(todoId, userId);
  }
}
