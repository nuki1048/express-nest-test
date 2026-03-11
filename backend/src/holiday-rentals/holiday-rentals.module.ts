import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { HolidayRentalsController } from './holiday-rentals.controller';
import { HolidayRentalsService } from './holiday-rentals.service';

@Module({
  imports: [AuthModule],
  controllers: [HolidayRentalsController],
  providers: [HolidayRentalsService],
  exports: [HolidayRentalsService],
})
export class HolidayRentalsModule {}
