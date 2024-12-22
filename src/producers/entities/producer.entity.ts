import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Farm } from '../../farms/entities/farm.entity';

@Entity()
export class Producer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  cpfOrCnpj: string;

  @Column()
  name: string;

  @OneToMany(() => Farm, (farm) => farm.producer)
  farms: Farm[];
}
