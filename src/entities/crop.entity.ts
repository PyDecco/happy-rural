import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Farm } from './farm.entity';

@Entity('crops')
export class Crop {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  cropName: string; 

  @Column('float')
  vegetationArea: number; 

  @Column('date')
  plantingDate: string;

  @Column('date', { nullable: true })
  harvestDate: string; 

  @ManyToOne(() => Farm, (farm) => farm.crops, { onDelete: 'CASCADE' })
  farm: Farm;
}
