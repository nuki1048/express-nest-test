import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { YourFutureHomeController } from './your-future-home.controller';
import { YourFutureHomeService } from './your-future-home.service';

@Module({
  imports: [AuthModule],
  controllers: [YourFutureHomeController],
  providers: [YourFutureHomeService],
  exports: [YourFutureHomeService],
})
export class YourFutureHomeModule {}
