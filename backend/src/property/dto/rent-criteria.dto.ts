import { IsNotEmpty, IsOptional } from 'class-validator';

export class RentCriteriaDto {
  @IsOptional()
  @IsNotEmpty()
  deposit: number;

  @IsOptional()
  @IsNotEmpty()
  petAllowed: boolean;

  @IsOptional()
  @IsNotEmpty()
  paymentPeriod: string;

  @IsOptional()
  @IsNotEmpty()
  habitable: string;

  @IsOptional()
  @IsNotEmpty()
  minimumStayDuration: number;
}
