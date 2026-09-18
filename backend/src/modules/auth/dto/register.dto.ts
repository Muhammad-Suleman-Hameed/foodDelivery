import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../../users/entities/user.entity';

export class RegisterDto {
  @ApiProperty({ example: 'Muhammad Suleman', description: 'Full name' })
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty({ example: 'user@example.com', description: 'Unique email address' })
  @IsEmail({}, { message: 'Must be a valid email address' })
  email: string;

  @ApiProperty({ example: 'Password123!', description: 'Account password (min 6 characters)' })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @ApiProperty({
    enum: UserRole,
    default: UserRole.REGULAR_USER,
    required: false,
    description: 'Select role: REGULAR_USER or RESTAURANT_OWNER',
  })
  @IsEnum(UserRole, { message: 'Role must be REGULAR_USER or RESTAURANT_OWNER' })
  @IsOptional()
  role?: UserRole;

  @ApiProperty({ example: '+923001234567', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: '123 Food Street, Downtown', required: false })
  @IsString()
  @IsOptional()
  address?: string;
}
