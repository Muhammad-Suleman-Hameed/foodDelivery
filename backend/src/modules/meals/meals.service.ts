import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meal, MealCategory } from './entities/meal.entity';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { Restaurant } from '../restaurants/entities/restaurant.entity';

@Injectable()
export class MealsService implements OnModuleInit {
  private readonly logger = new Logger(MealsService.name);

  constructor(
    @InjectRepository(Meal)
    private readonly mealRepository: Repository<Meal>,
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
  ) {}

  async onModuleInit() {
    await this.seedInitialMeals();
  }

  async create(ownerId: number, restaurantId: number, dto: CreateMealDto): Promise<Meal> {
    const restaurant = await this.restaurantRepository.findOne({ where: { id: restaurantId } });
    if (!restaurant) {
      throw new NotFoundException(`Restaurant #${restaurantId} not found`);
    }
    if (restaurant.ownerId !== ownerId) {
      throw new ForbiddenException('You can only add meals to your own restaurant');
    }

    const meal = this.mealRepository.create({
      ...dto,
      restaurantId,
    });
    return await this.mealRepository.save(meal);
  }

  async findAllByRestaurant(restaurantId: number, category?: string): Promise<Meal[]> {
    const query = this.mealRepository.createQueryBuilder('meal')
      .where('meal.restaurantId = :restaurantId', { restaurantId });

    if (category && category.trim() && category.toLowerCase() !== 'all') {
      query.andWhere('LOWER(meal.category) = LOWER(:category)', { category: category.trim() });
    }

    query.orderBy('meal.category', 'ASC').addOrderBy('meal.price', 'ASC');
    return await query.getMany();
  }

  async findOne(id: number): Promise<Meal> {
    const meal = await this.mealRepository.findOne({
      where: { id },
      relations: ['restaurant'],
    });
    if (!meal) {
      throw new NotFoundException(`Meal #${id} not found`);
    }
    return meal;
  }

  async update(ownerId: number, id: number, dto: UpdateMealDto): Promise<Meal> {
    const meal = await this.findOne(id);
    if (meal.restaurant.ownerId !== ownerId) {
      throw new ForbiddenException('You can only update meals from your own restaurant');
    }

    await this.mealRepository.update(id, dto);
    return await this.findOne(id);
  }

  async toggleAvailability(ownerId: number, id: number): Promise<Meal> {
    const meal = await this.findOne(id);
    if (meal.restaurant.ownerId !== ownerId) {
      throw new ForbiddenException('You can only modify meals from your own restaurant');
    }

    meal.isAvailable = !meal.isAvailable;
    return await this.mealRepository.save(meal);
  }

  async remove(ownerId: number, id: number): Promise<{ success: boolean; message: string }> {
    const meal = await this.findOne(id);
    if (meal.restaurant.ownerId !== ownerId) {
      throw new ForbiddenException('You can only delete meals from your own restaurant');
    }

    await this.mealRepository.remove(meal);
    return { success: true, message: `Meal #${id} deleted successfully` };
  }

  private async seedInitialMeals() {
    const count = await this.mealRepository.count();
    if (count > 0) return;

    this.logger.log('Seeding initial menu meals for restaurants...');
    const restaurants = await this.restaurantRepository.find();
    if (restaurants.length === 0) return;

    const burgerLab = restaurants.find((r) => r.name.includes('Burger')) || restaurants[0];
    const pizzaCo = restaurants.find((r) => r.name.includes('Pizza')) || restaurants[1] || restaurants[0];
    const bobaCafe = restaurants.find((r) => r.name.includes('Boba')) || restaurants[2] || restaurants[0];
    const bakery = restaurants.find((r) => r.name.includes('Bakery')) || restaurants[3] || restaurants[0];

    const sampleMeals: Partial<Meal>[] = [
      // The Burger Lab Meals
      {
        restaurantId: burgerLab.id,
        name: 'Smash Angus Double Cheeseburger',
        description: 'Two grass-fed Angus beef patties, double American cheese, caramelized onions, house mayo.',
        price: 9.49,
        category: MealCategory.FAST_FOOD,
        imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500',
        isAvailable: true,
      },
      {
        restaurantId: burgerLab.id,
        name: 'Crispy Nashville Hot Chicken Burger',
        description: 'Buttermilk fried chicken breast tossed in spicy chili oil, tangy slaw, and garlic dill pickles.',
        price: 8.99,
        category: MealCategory.FAST_FOOD,
        imageUrl: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=500',
        isAvailable: true,
      },
      {
        restaurantId: burgerLab.id,
        name: 'Cravo Duo Combo Deal (2 Burgers + Fries + 2 Drinks)',
        description: 'Special combo deal: 2 Angus burgers, large seasoned fries, and 2 chilled beverages.',
        price: 18.99,
        category: MealCategory.DEALS,
        imageUrl: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500',
        isAvailable: true,
      },
      {
        restaurantId: burgerLab.id,
        name: 'Loaded Truffle Parmesan Fries',
        description: 'Golden crispy fries drizzled with white truffle oil, shaved parmesan, and fresh herbs.',
        price: 4.99,
        category: MealCategory.FAST_FOOD,
        imageUrl: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500',
        isAvailable: true,
      },
      {
        restaurantId: burgerLab.id,
        name: 'Thick Salted Caramel Milkshake',
        description: 'Hand-spun vanilla gelato blended with rich salted caramel fudge and whipped cream.',
        price: 4.49,
        category: MealCategory.DRINKS,
        imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500',
        isAvailable: true,
      },
      {
        restaurantId: burgerLab.id,
        name: 'Fresh Mint Lemonade Cooler',
        description: 'Crushed garden mint, freshly squeezed lemons, and sparkling soda.',
        price: 2.99,
        category: MealCategory.DRINKS,
        imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500',
        isAvailable: true,
      },

      // Crust & Co. Pizza Meals
      {
        restaurantId: pizzaCo.id,
        name: 'Margherita Burrata Pizza (12 inch)',
        description: 'San Marzano tomato sauce, fresh creamy burrata, Fior di Latte mozzarella, extra virgin olive oil.',
        price: 13.99,
        category: MealCategory.FAST_FOOD,
        imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500',
        isAvailable: true,
      },
      {
        restaurantId: pizzaCo.id,
        name: 'Pepperoni & Hot Honey Feast',
        description: 'Double artisanal pepperoni, chili honey drizzle, fresh mozzarella on sourdough crust.',
        price: 15.49,
        category: MealCategory.FAST_FOOD,
        imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500',
        isAvailable: true,
      },
      {
        restaurantId: pizzaCo.id,
        name: 'Pizza Party Deal (2 Large Pizzas + Garlic Bread)',
        description: 'Save 30% with any two 14-inch large pizzas with buttery garlic knots.',
        price: 24.99,
        category: MealCategory.DEALS,
        imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500',
        isAvailable: true,
      },
      {
        restaurantId: pizzaCo.id,
        name: 'Italian Tiramisu Cup',
        description: 'Espresso-soaked ladyfingers with light mascarpone custard and dark cocoa powder.',
        price: 5.49,
        category: MealCategory.DESSERT,
        imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500',
        isAvailable: true,
      },

      // Boba & Sip Café
      {
        restaurantId: bobaCafe.id,
        name: 'Tiger Brown Sugar Milk Tea',
        description: 'Slow-cooked warm tapioca pearls coated with caramelized Okinawa brown sugar and organic milk.',
        price: 5.25,
        category: MealCategory.DRINKS,
        imageUrl: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=500',
        isAvailable: true,
      },
      {
        restaurantId: bobaCafe.id,
        name: 'Matcha Strawberry Cloud Latte',
        description: 'Premium ceremonial grade Uji matcha layered over pure strawberry purée and cold cream.',
        price: 5.75,
        category: MealCategory.DRINKS,
        imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500',
        isAvailable: true,
      },
      {
        restaurantId: bobaCafe.id,
        name: 'Boba Bundle Deal (Any 2 Signature Teas)',
        description: 'Special duo deal for bubble tea lovers. Mix and match any two large drinks.',
        price: 9.49,
        category: MealCategory.DEALS,
        imageUrl: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=500',
        isAvailable: true,
      },

      // Sweet Velvet Bakery
      {
        restaurantId: bakery.id,
        name: 'Warm Chocolate Molten Lava Cake',
        description: 'Rich dark chocolate sponge with a warm oozing chocolate core, served with vanilla cream.',
        price: 6.99,
        category: MealCategory.DESSERT,
        imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500',
        isAvailable: true,
      },
      {
        restaurantId: bakery.id,
        name: 'Belgian Crispy Waffle with Strawberries',
        description: 'Golden pearl-sugar waffle topped with fresh organic strawberries and Nutella drizzle.',
        price: 7.49,
        category: MealCategory.DESSERT,
        imageUrl: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=500',
        isAvailable: true,
      },
    ];

    for (const item of sampleMeals) {
      const meal = this.mealRepository.create(item);
      await this.mealRepository.save(meal);
    }
    this.logger.log(`${sampleMeals.length} menu meals seeded across categories`);
  }
}
