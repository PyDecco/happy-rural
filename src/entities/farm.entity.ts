import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Producer } from './producer.entity';
import { Crop } from './crop.entity';

@Entity('farms')
export class Farm {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column('float')
  totalArea: number;  

  @Column('float')
  agriculturalArea: number;  

  @OneToMany(() => Crop, (crop) => crop.farm)
  crops: Crop[];

  @ManyToOne(() => Producer, (producer) => producer.farms, { onDelete: 'CASCADE' })
  producer: Producer;
}
