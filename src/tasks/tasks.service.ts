import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
@Injectable()
export class TasksService {
  private tasks: Task[] = [];
  async getAllTasks() {
    return this.tasks;
  }
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return await task;
  }
  async getTaskById(id: string): Promise<Task> {
    return this.tasks.find((task) => task.id === id);
  }
  async deleteTaskById(id: string) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }
  async patchTaskById(id: string, status: TaskStatus): Promise<Task> {
    const task = this.getTaskById(id);
    (await task).status = status;
    return task;
  }
  async getTaskWithFilters(filterDto: GetTaskFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;
    let tasks = await this.getAllTasks();
    if (status) {
      tasks = (await tasks).filter((task) => task.status === status);
    }
    if (search) {
      tasks = (await tasks).filter((task) => {
        if (task.title.includes(search) || task.description.includes(search)) {
          return true;
        }
      });
    }
    return tasks;
  }
}
