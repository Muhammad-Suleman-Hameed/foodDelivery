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
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User, UserRole } from '../users/entities/user.entity';

@ApiTags('Restaurants')
@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new restaurant (Restaurant Owner only)' })
  @ApiResponse({ status: 201, description: 'Restaurant created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden: Owner role required' })
  async create(
    @CurrentUser() owner: User,
    @Body() createRestaurantDto: CreateRestaurantDto,
  ) {
    return this.restaurantsService.create(owner.id, createRestaurantDto);
  }

  @Get()
  @ApiOperation({ summary: 'Browse all restaurants with optional search & category filter' })
  @ApiQuery({ name: 'search', required: false, description: 'Search by name or cuisine' })
  @ApiQuery({ name: 'cuisine', required: false, description: 'Filter by category: Fast Food, Drinks, Deals, Dessert' })
  @ApiResponse({ status: 200, description: 'List of restaurants' })
  async findAll(
    @Query('search') search?: string,
    @Query('cuisine') cuisine?: string,
  ) {
    return this.restaurantsService.findAll(search, cuisine);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all restaurants owned by the authenticated owner' })
  @ApiResponse({ status: 200, description: 'List of owned restaurants' })
  async findMyRestaurants(@CurrentUser() owner: User) {
    return this.restaurantsService.findMyRestaurants(owner.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get restaurant details by ID' })
  @ApiResponse({ status: 200, description: 'Restaurant details' })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.restaurantsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update restaurant details (Owner only)' })
  @ApiResponse({ status: 200, description: 'Restaurant updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden: You do not own this restaurant' })
  async update(
    @CurrentUser() owner: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ) {
    return this.restaurantsService.update(owner.id, id, updateRestaurantDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a restaurant (Owner only)' })
  @ApiResponse({ status: 200, description: 'Restaurant deleted successfully' })
  async remove(
    @CurrentUser() owner: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.restaurantsService.remove(owner.id, id);
  }
}
