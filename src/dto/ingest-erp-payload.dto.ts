import { Type } from 'class-transformer';
import {
  IsISO8601,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';

class ErpPayloadDataDto {
  [key: string]: unknown;
}

export class IngestErpPayloadDto {
  @IsObject()
  @ValidateNested()
  @Type(() => ErpPayloadDataDto)
  public data!: Record<string, unknown>;

  @IsString()
  @MinLength(1)
  public entityType!: string;

  @IsString()
  @MinLength(1)
  public externalId!: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  public idempotencyKey?: string;

  @IsOptional()
  @IsISO8601()
  public occurredAt?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  public payloadVersion?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  public rawEventType?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  public sourceConnectionId?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  public traceId?: string;

  @IsString()
  @MinLength(1)
  public tenantExternalId!: string;
}
