import { Exclude, Expose, Transform } from 'class-transformer';
import { IsOptional, IsNotEmpty } from 'class-validator';

export enum PropertyOrder {
  ASC = 'ASC',
  DESC = 'DESC',
  ONE = 1,
  NEGONE = -1,
}

export class OrderFilter {
  @IsOptional()
  @IsNotEmpty()
  created_at: PropertyOrder;

  @IsOptional()
  @IsNotEmpty()
  price: PropertyOrder;
}

export class Filters {
  @IsOptional()
  @IsNotEmpty()
  propertyType?: string;

  @IsOptional()
  @IsNotEmpty()
  propertyFeatures?: string;

  @IsOptional()
  @IsNotEmpty()
  @Transform(({ value }) => String(value).toUpperCase())
  purpose?: string;

  @IsOptional()
  @IsNotEmpty()
  cityId?: number | string;

  @IsOptional()
  @IsNotEmpty()
  userId?: number | string;

  @IsOptional()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  price?: number;

  @IsOptional()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  noOfBedRoom?: number;
}

@Exclude()
export class QueryFilterPropertyDto {
  @Expose()
  @IsOptional()
  @IsNotEmpty()
  @Transform(({ value }) => (value == undefined || !value ? 1 : Number(value)))
  page: number;

  @Expose()
  @IsOptional()
  @IsNotEmpty()
  @Transform(({ value }) => (value == undefined || !value ? 1 : Number(value)))
  perPage: number;

  @Expose()
  @IsOptional()
  @IsNotEmpty()
  order: OrderFilter;

  @Expose()
  @IsOptional()
  @IsNotEmpty()
  filters: Filters;
}
