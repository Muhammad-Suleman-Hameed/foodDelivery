import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meal } from './entities/meal.entity';
import { MealsService } from './meals.service';
import { MealsController } from './meals.controller';
import { RestaurantsModule } from '../restaurants/restaurants.module';

@Module({
  imports: [TypeOrmModule.forFeature([Meal]), RestaurantsModule],
  controllers: [MealsController],
  providers: [MealsService],
  exports: [MealsService, TypeOrmModule],
})
export class MealsModule {}
