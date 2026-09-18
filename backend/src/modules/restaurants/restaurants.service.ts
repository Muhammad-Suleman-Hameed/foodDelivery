import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, ILike } from 'typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class RestaurantsService implements OnModuleInit {
  private readonly logger = new Logger(RestaurantsService.name);

  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    private readonly usersService: UsersService,
  ) {}

  async onModuleInit() {
    await this.seedInitialRestaurants();
  }

  async create(ownerId: number, dto: CreateRestaurantDto): Promise<Restaurant> {
    const restaurant = this.restaurantRepository.create({
      ...dto,
      ownerId,
      rating: 4.8,
      ratingCount: 1,
    });
    return await this.restaurantRepository.save(restaurant);
  }

  async findAll(search?: string, cuisine?: string): Promise<Restaurant[]> {
    const query = this.restaurantRepository.createQueryBuilder('restaurant');

    if (search && search.trim()) {
      query.andWhere(
        '(LOWER(restaurant.name) LIKE LOWER(:search) OR LOWER(restaurant.cuisine) LIKE LOWER(:search) OR LOWER(restaurant.description) LIKE LOWER(:search))',
        { search: `%${search.trim()}%` },
      );
    }

    if (cuisine && cuisine.trim() && cuisine.toLowerCase() !== 'all') {
      query.andWhere('LOWER(restaurant.cuisine) LIKE LOWER(:cuisine)', {
        cuisine: `%${cuisine.trim()}%`,
      });
    }

    query.orderBy('restaurant.rating', 'DESC');
    return await query.getMany();
  }

  async findOne(id: number): Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!restaurant) {
      throw new NotFoundException(`Restaurant #${id} not found`);
    }
    return restaurant;
  }

  async findMyRestaurants(ownerId: number): Promise<Restaurant[]> {
    return await this.restaurantRepository.find({
      where: { ownerId },
      order: { createdAt: 'DESC' },
    });
  }

  async update(ownerId: number, id: number, dto: UpdateRestaurantDto): Promise<Restaurant> {
    const restaurant = await this.findOne(id);
    if (restaurant.ownerId !== ownerId) {
      throw new ForbiddenException('You do not have permission to update this restaurant');
    }
    await this.restaurantRepository.update(id, dto);
    return await this.findOne(id);
  }

  async remove(ownerId: number, id: number): Promise<{ success: boolean; message: string }> {
    const restaurant = await this.findOne(id);
    if (restaurant.ownerId !== ownerId) {
      throw new ForbiddenException('You do not have permission to delete this restaurant');
    }
    await this.restaurantRepository.remove(restaurant);
    return { success: true, message: `Restaurant #${id} removed successfully` };
  }

  private async seedInitialRestaurants() {
    const count = await this.restaurantRepository.count();
    if (count > 0) return;

    this.logger.log('Seeding sample restaurants...');
    const seedData: Partial<Restaurant>[] = [
      {
        name: 'The Burger Lab',
        description: 'Smash Angus beef burgers, caramelized onions, melted cheddar, and secret sauce.',
        cuisine: 'Fast Food • Burgers • Deals',
        imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600',
        address: 'Sector F-7, Jinnah Super, Islamabad',
        rating: 4.8,
        ratingCount: 340,
        deliveryTime: '20-30 min',
        deliveryFee: 1.49,
        dealBadge: '25% OFF Deals',
        ownerId: 1,
      },
      {
        name: 'Crust & Co. Artisan Pizza',
        description: 'Wood-fired sourdough Neapolitan pizzas, fresh mozzarella, and aromatic basil.',
        cuisine: 'Fast Food • Italian • Pizza',
        imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600',
        address: 'MM Alam Road, Gulberg III, Lahore',
        rating: 4.9,
        ratingCount: 520,
        deliveryTime: '25-40 min',
        deliveryFee: 0.00,
        dealBadge: 'Free Delivery',
        ownerId: 1,
      },
      {
        name: 'Boba & Sip Café',
        description: 'Handcrafted brown sugar milk teas, fruit refreshers, iced matcha, and artisan sodas.',
        cuisine: 'Drinks • Beverages • Dessert',
        imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600',
        address: 'DHA Phase 5, Commercial Area, Lahore',
        rating: 4.7,
        ratingCount: 210,
        deliveryTime: '15-25 min',
        deliveryFee: 0.99,
        dealBadge: 'Buy 1 Get 1 Free',
        ownerId: 1,
      },
      {
        name: 'Sweet Velvet Bakery',
        description: 'Warm molten lava cakes, Belgian chocolate waffles, and artisan cinnamon rolls.',
        cuisine: 'Dessert • Bakery • Sweets',
        imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600',
        address: 'Clifton Block 4, Karachi',
        rating: 4.8,
        ratingCount: 180,
        deliveryTime: '20-30 min',
        deliveryFee: 1.29,
        dealBadge: '15% OFF Deals',
        ownerId: 1,
      },
    ];

    for (const item of seedData) {
      const restaurant = this.restaurantRepository.create(item);
      await this.restaurantRepository.save(restaurant);
    }
    this.logger.log('4 sample restaurants seeded successfully');
  }
}
