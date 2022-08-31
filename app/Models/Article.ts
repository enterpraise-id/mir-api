import { DateTime } from 'luxon'
import { afterDelete, BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { slugify } from '@ioc:Adonis/Addons/LucidSlugify'
import User from './User'
import ImageHelper from 'App/Helpers/ImageHelper'

export default class Article extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public title: string

  @column()
  @slugify({
    strategy: 'dbIncrement',
    fields: ['title'],
    allowUpdates: true
  })
  public slug: string;

  @column()
  public content: string

  @column()
  public thumbnail: string

  @column()
  public isFeatured: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @afterDelete()
  public static afterDeleteHook(article: Article) {
    ImageHelper.delete(article.thumbnail)
  }
}
