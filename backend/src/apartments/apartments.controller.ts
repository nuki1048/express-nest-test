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

  @Get(':id')
  getApartment(@Param('id') id: string) {
    return this.apartmentsService.getApartment(id);
  }

  @Post()
  createApartment(@Body() createApartmentDto: CreateApartmentDto) {
    return this.apartmentsService.createApartment(createApartmentDto);
  }

  @Patch(':id')
  updateApartment(
    @Param('id') id: string,
    @Body() updateApartmentDto: UpdateApartmentDto,
  ) {
    return this.apartmentsService.updateApartment(id, updateApartmentDto);
  }

  @Delete(':id')
  deleteApartment(@Param('id') id: string) {
    return this.apartmentsService.deleteApartment(id);
  }
}
