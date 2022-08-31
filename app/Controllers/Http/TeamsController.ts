import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Team from 'App/Models/Team'
import TeamValidator from 'App/Validators/TeamValidator'

export default class TeamsController {
    public async store({ request, response, auth}: HttpContextContract){
        await auth.use('api').authenticate()
        const payload = await request.validate(TeamValidator)

        const team = await Team.create({
            name: payload.name,
            role: payload.role,
            image: payload.image,
            status: payload.status
        })

        return response.created({
            status: 201,
            message: 'Team created successfully!',
            data: team.serialize()
        })
    }

    public async update({ params, response, auth}: HttpContextContract){
        await auth.use('api').authenticate()
        const team = await Team.find(params.id)

        if (team?.status == true){
            await team.merge({
                status: false
            }).save()

            return response.ok({
                status: 201,
                data: team.serialize()
            })
        }
        else {
            await team?.merge({
                status: true
            }).save()

            return response.ok({
                status: 201,
                data: team!.serialize()
            })
        }
    }

    public async show({ response }: HttpContextContract){
        const team = await Team.all()
        
        if (!team){
            return response.notFound({
                status: 400,
                message: 'Team not found'
            })
        }

        try {
            return response.ok({
                status: 200,
                message: 'Team retrieved successfully',
                data: team
            })
        }
        catch (err){
            return response.badGateway({
                status: 500,
                message: 'Team not retrieved',
                err
            })
        }
    }

    public async delete({ params, response, auth }: HttpContextContract){
        await auth.use('api').authenticate()
        const team = await Team.find(params.id)

        if (!team){
            return response.notFound({
                status: 404,
                message: 'Team not found'
            })
        }

        try {
            await team.delete();
            return response.ok({
              status: 200,
              message: "Team deleted successfully",
            });
          } catch (errors) {
            return response.badRequest({
              status: 400,
              message: "Team not deleted",
              errors,
            });
          }
    }
}
