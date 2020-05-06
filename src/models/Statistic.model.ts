import {BaseEntity, Entity, Column, PrimaryGeneratedColumn, ManyToOne, Index} from 'typeorm';
import { Identity } from '.';

@Entity()
@Index(['identity', 'achievementId'])
export default class Statistic extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(type => Identity, identity => identity.statistics)
  identity: Identity

  @Column()
  realmSlug: string

  @Column()
  characterName: string

  @Column()
  achievementId: number

  @Column('decimal', { precision: 1000, scale: 2 })
  quantity: number
}