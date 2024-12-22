import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Producer } from '../../producers/entities/producer.entity';

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

  @Column('float')
  vegetationArea: number;

  @Column('simple-array') 
  crops: string[];

  @ManyToOne(() => Producer, (producer) => producer.farms, { onDelete: 'CASCADE' })
  producer: Producer;
}
