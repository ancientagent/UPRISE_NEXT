import { Controller, Get, Query } from '@nestjs/common';
import { PlacesService, PlaceSuggestion, ReverseGeocodeResult } from './places.service';

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

  @Get('reverse')
  async reverse(
    @Query('latitude') latitude = '',
    @Query('longitude') longitude = '',
    @Query('country') country = 'US',
  ): Promise<{ success: true; data: ReverseGeocodeResult }> {
    const lat = Number.parseFloat(latitude);
    const lng = Number.parseFloat(longitude);
    const location = await this.placesService.reverseGeocode(lat, lng, country);
    return { success: true, data: location };
  }
}
