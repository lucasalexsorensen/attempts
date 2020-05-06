import {BaseEntity, Entity, Column, PrimaryColumn, OneToMany} from 'typeorm';
import { BattleNetRegion } from '../enums';
import Statistic from './Statistic.model';

@Entity()
export default class Identity extends BaseEntity {
  @PrimaryColumn()
  sub: string

  @Column()
  accessToken: string

  @Column()
  idToken: string

  @Column()
  exp: number

  @Column()
  battletag: string

  @Column()
  region: BattleNetRegion

  @OneToMany(type => Statistic, statistic => statistic.identity)
  statistics: Statistic[]
}