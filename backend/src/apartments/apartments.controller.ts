import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApartmentsService } from './apartments.service';
import { CreateApartmentDto } from './dto/create-apartment';
import { UpdateApartmentDto } from './dto/update-apartment';

@Controller('apartments')
export class ApartmentsController {
  constructor(private readonly apartmentsService: ApartmentsService) {}

  @Get()
  getApartments() {
    return this.apartmentsService.getApartments();
  }

  @Get(':slug')
  getApartment(@Param('slug') slug: string) {
    return this.apartmentsService.getApartment(slug);
  }

  @Post()
  createApartment(@Body() createApartmentDto: CreateApartmentDto) {
    return this.apartmentsService.createApartment(createApartmentDto);
  }

  @Patch(':slug')
  updateApartment(
    @Param('slug') slug: string,
    @Body() updateApartmentDto: UpdateApartmentDto,
  ) {
    return this.apartmentsService.updateApartment(slug, updateApartmentDto);
  }

  @Delete(':slug')
  deleteApartment(@Param('slug') slug: string) {
    return this.apartmentsService.deleteApartment(slug);
  }
}
