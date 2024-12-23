import { Controller, Get, Param } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboards')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('producer/:id/overview')
  async getOverview(@Param('id') producerId: string) {
    return this.dashboardService.getOverview(producerId);
  }

  @Get('producer/:id/pie-chart/state')
  async getFarmsByState(@Param('id') producerId: string) {
    return this.dashboardService.getFarmsByState(producerId);
  }

  @Get('producer/:id/pie-chart/crop')
  async getCropsByType(@Param('id') producerId: string) {
    return this.dashboardService.getCropsByType(producerId);
  }

  @Get('producer/:id/pie-chart/land-usage')
  async getLandUsage(@Param('id') producerId: string) {
    return this.dashboardService.getLandUsage(producerId);
  }
}

