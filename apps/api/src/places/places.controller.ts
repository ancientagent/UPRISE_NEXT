import { Controller, Get, Query } from '@nestjs/common';
import { PlacesService, PlaceSuggestion } from './places.service';

@Controller('places')
export class PlacesController {
  constructor(private placesService: PlacesService) {}

  @Get('cities')
  async cities(
    @Query('input') input = '',
    @Query('country') country = 'us',
  ): Promise<{ success: true; data: PlaceSuggestion[] }> {
    const suggestions = await this.placesService.autocompleteCities(input, country);
    return { success: true, data: suggestions };
  }
}
