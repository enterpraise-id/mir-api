import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ImageHelper from 'App/Helpers/ImageHelper'
import Portfolio from 'App/Models/Portfolio'
import Tag from 'App/Models/Tag'
import StorePortfolioValidator from 'App/Validators/StorePortfolioValidator'
import UpdatePortfolioValidator from 'App/Validators/UpdatePortfolioValidator'

export default class PortfoliosController {
    public async store({ request, response, auth }: HttpContextContract){
        await auth.use('api').authenticate()
        const payload = await request.validate(StorePortfolioValidator)

        const portfolio = await Portfolio.create({
            title: payload.title,
            description: payload.description,
            thumbnail: payload.thumbnail
        })

        for (const i of payload.tags){
            const tag = await Tag.firstOrCreate({ name: i})
            await portfolio.related('tags').attach([tag.id])
        }

        response.created({
            status: 201,
            message: 'Portfolio created successfully',
            data: portfolio.serialize()
        })
    }

    public async update({ request, response, auth, params }: HttpContextContract){
        await auth.use('api').authenticate()
        const payload = await request.validate(UpdatePortfolioValidator)
        const portfolio = await Portfolio.find(params.id)

        if (!portfolio){
            return response.notFound({
                status: 404,
                message: 'Portfolio not found'
            })
        }

        if (payload.thumbnail){
            ImageHelper.delete(portfolio.thumbnail)
        }

        try {
            await portfolio.merge(payload).save()
            return response.ok({
                status: 201,
                message: 'Portfolio updated',
                data: portfolio.serialize()
            })
        }
        catch (err) {
            return response.badRequest({
                status: 400,
                message: 'Portfolio not updated',
                err
            })
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
    
        const query = Portfolio.query().preload("tags");
    
        const allowedOrders = ["createdAt", "id", "title", "viewCount"];
    
        if (allowedOrders.includes(orderBy)) {
          query.orderBy(orderBy, orderSort);
        }
    
        if (search) {
          query.where("title", "like", `%${search}%`);
        }
    
        const news = await query.paginate(page, perPage);
        return response.ok({
          status: 200,
          message: "Portfolio paginated successfully",
          ...news.toJSON(),
        });
      }

      public async delete({ params, response, auth }: HttpContextContract) {
        await auth.use("api").authenticate();
    
        const portfolio = await Portfolio.find(params.id);
    
        if (!portfolio) {
          return response.notFound({
            status: 404,
            message: "Portfolio not found",
          });
        }
    
        try {
          await portfolio.delete();
          return response.ok({
            status: 200,
            message: "Portfolio deleted successfully",
          });
        } catch (err) {
          return response.badRequest({
            status: 400,
            message: "Portfolio not deleted",
            err,
          });
        }
      }
}
