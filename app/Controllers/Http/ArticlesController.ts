import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ImageHelper from 'App/Helpers/ImageHelper'
import Article from 'App/Models/Article'
import StoreArticleValidator from 'App/Validators/StoreArticleValidator'
import UpdateArticleValidator from 'App/Validators/UpdateArticleValidator'

export default class ArticlesController {
    public async store({ request, response, auth}: HttpContextContract){
        await auth.use('api').authenticate()
        const payload = await request.validate(StoreArticleValidator)

        const article = await Article.create({
            title: payload.title,
            userId: auth.user!.id,
            content: payload.content,
            thumbnail: payload.thumbnail,
            isFeatured: payload.isFeatured
        })

        return response.created({
            status: 201,
            message: 'Article created successfully!',
            data: article.serialize()
        })
    }

    public async update({ request, response, auth, params}: HttpContextContract){
        await auth.use('api').authenticate()
        const payload = await request.validate(UpdateArticleValidator)
        const article = await Article.find(params.id)
        
        if (!article){
            response.notFound({
                status: 404,
                message: 'Article not found!'
            })
        }

        if (payload.thumbnail){
            ImageHelper.delete(article!.thumbnail)
        }

        try {
            await article!.merge(payload).save();
            return response.ok({
              status: 200,
              message: "Article updated successfully",
              data: article!.serialize(),
            });
          } catch (errors) {
            return response.badRequest({
              status: 400,
              message: "Article not updated",
              errors,
            });
          }
        }

        public async paginate({ request, response }: HttpContextContract) {
            const {
              page = 1,
              perPage = 10,
              orderBy = "created_at",
              orderSort = "desc",
              search,
            } = request.qs();
        
            const query = Article.query().preload("user");
        
            const allowedOrders = ["createdAt", "id", "title"];
        
            if (allowedOrders.includes(orderBy)) {
              query.orderBy(orderBy, orderSort);
            }
        
            if (search) {
              query.where("title", "like", `%${search}%`);
            }
        
            const news = await query.paginate(page, perPage);
            return response.ok({
              status: 200,
              message: "Articles paginated successfully",
              ...news.toJSON(),
            });
          }
        
          public async findBySlug({ params, response }: HttpContextContract) {
            const article = await Article.query()
              .preload("user")
              .where("slug", params.slug)
              .first();
        
            if (!article) {
              return response.notFound({
                status: 404,
                message: "Article not found",
              });
            }
        
            return response.ok({
              status: 200,
              message: "Article found",
              data: article,
            });
          }
        
          public async delete({ params, response, auth }: HttpContextContract) {
            await auth.use("api").authenticate();
        
            const article = await Article.find(params.id);
        
            if (!article) {
              return response.notFound({
                status: 404,
                message: "Article not found",
              });
            }
        
            try {
              await article.delete();
              return response.ok({
                status: 200,
                message: "Article deleted successfully",
              });
            } catch (errors) {
              return response.badRequest({
                status: 400,
                message: "Article not deleted",
                errors,
              });
            }
          }
        
}
