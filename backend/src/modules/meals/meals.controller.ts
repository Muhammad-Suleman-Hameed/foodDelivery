import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { MealsService } from './meals.service';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User, UserRole } from '../users/entities/user.entity';

@ApiTags('Meals')
@Controller()
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  @Post('restaurants/:restaurantId/meals')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a meal to your restaurant (Owner only)' })
  @ApiResponse({ status: 201, description: 'Meal created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden: You do not own this restaurant' })
  async create(
    @CurrentUser() owner: User,
    @Param('restaurantId', ParseIntPipe) restaurantId: number,
    @Body() createMealDto: CreateMealDto,
  ) {
    return this.mealsService.create(owner.id, restaurantId, createMealDto);
  }

  @Get('restaurants/:restaurantId/meals')
  @ApiOperation({ summary: 'Get all meals for a restaurant with optional category filter' })
  @ApiQuery({ name: 'category', required: false, description: 'Filter by category: Fast Food, Drinks, Deals, Dessert' })
  @ApiResponse({ status: 200, description: 'List of meals' })
  async findAllByRestaurant(
    @Param('restaurantId', ParseIntPipe) restaurantId: number,
    @Query('category') category?: string,
  ) {
    return this.mealsService.findAllByRestaurant(restaurantId, category);
  }

  @Get('meals/:id')
  @ApiOperation({ summary: 'Get meal details by ID' })
  @ApiResponse({ status: 200, description: 'Meal details' })
  @ApiResponse({ status: 404, description: 'Meal not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.mealsService.findOne(id);
  }

  @Patch('meals/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update meal details (Owner only)' })
  @ApiResponse({ status: 200, description: 'Meal updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden: You do not own this restaurant' })
  async update(
    @CurrentUser() owner: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMealDto: UpdateMealDto,
  ) {
    return this.mealsService.update(owner.id, id, updateMealDto);
  }

  @Patch('meals/:id/toggle')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle meal availability in kitchen (Owner only)' })
  @ApiResponse({ status: 200, description: 'Availability toggled successfully' })
  async toggleAvailability(
    @CurrentUser() owner: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.mealsService.toggleAvailability(owner.id, id);
  }

  @Delete('meals/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a meal (Owner only)' })
  @ApiResponse({ status: 200, description: 'Meal deleted successfully' })
  async remove(
    @CurrentUser() owner: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.mealsService.remove(owner.id, id);
  }
}
