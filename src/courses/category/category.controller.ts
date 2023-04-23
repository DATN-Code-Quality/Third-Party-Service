import { Metadata } from '@grpc/grpc-js';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CategoryService } from './category.service';
import { CategoryResponce } from './interfaces/Category';

@Controller('courses')
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @GrpcMethod('GCategoryService', 'GetAllCategories')
  async getAllCategories(meta: Metadata): Promise<CategoryResponce> {
    const categories = await this.service.getAllCategory();
    return {
      data: categories,
      error: 0,
    };
  }
}
