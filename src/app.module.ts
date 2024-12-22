import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProducersModule } from './producers/producers.module';
import { FarmsModule } from './farms/farms.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AppDataSource } from './data-source'; // Importe o DataSource configurado

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    TypeOrmModule.forRoot(AppDataSource.options), // Use a configuração do DataSource
    ProducersModule,
    FarmsModule,
    DashboardModule,
  ],
})
export class AppModule {}


