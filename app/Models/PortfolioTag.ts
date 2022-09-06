import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Portfolio from './Portfolio'
import Tag from './Tag'

export default class PortfolioTag extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public portfolioId: number

  @column()
  public tagId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Portfolio)
  public portfolio: BelongsTo<typeof Portfolio>

  @belongsTo(() => Tag)
  public tag: BelongsTo<typeof Tag>
}
