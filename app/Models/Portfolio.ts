import { DateTime } from 'luxon'
import { afterDelete, BaseModel, beforeDelete, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Tag from './Tag'
import ImageHelper from 'App/Helpers/ImageHelper'

export default class Portfolio extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public thumbnail: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => Tag)
  public tags: ManyToMany<typeof Tag>

  @beforeDelete()
  public static async beforeDeleteHook(portfolio: Portfolio) {
    const tags = await portfolio.related('tags').query().exec()
    await portfolio.related('tags').detach(tags.map((tag) => tag.id))
  }

  @afterDelete()
  public static afterDeleteHook(portfolio: Portfolio) {
    ImageHelper.delete(portfolio.thumbnail)
  }
}
