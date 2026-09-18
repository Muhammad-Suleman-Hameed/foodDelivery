import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaymentMethod } from '../entities/order.entity';

export class CreateOrderDto {
  @ApiProperty({ example: 'House 14, Street 5, F-7/2, Islamabad' })
  @IsString()
  @IsNotEmpty({ message: 'Delivery address is required' })
  deliveryAddress: string;

  @ApiProperty({ enum: PaymentMethod, default: PaymentMethod.CASH_ON_DELIVERY, required: false })
  @IsEnum(PaymentMethod)
  @IsOptional()
  paymentMethod?: PaymentMethod;

  @ApiProperty({ example: 'Extra ketchup packets please', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
