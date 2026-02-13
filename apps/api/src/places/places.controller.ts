import { Controller, Get, Query } from '@nestjs/common';
import { PlacesService } from './places.service';

@Controller('places')
export class PlacesController {
  constructor(private placesService: PlacesService) {}

  @Get('cities')
  async cities(@Query('input') input = '', @Query('country') country = 'us') {
    const suggestions = await this.placesService.autocompleteCities(input, country);
    return { success: true, data: suggestions };
  }
}
