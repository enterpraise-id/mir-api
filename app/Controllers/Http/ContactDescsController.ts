import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ContactDesc from 'App/Models/ContactDesc'
import ContactDescValidator from 'App/Validators/ContactDescValidator'
import UpdateContactDescValidator from 'App/Validators/UpdateContactDescValidator'

export default class ContactDescsController {
    public async store({ request, auth, response }: HttpContextContract){
        await auth.use('api').authenticate()
        const payload = await request.validate(ContactDescValidator)
        
        try {
            const desc = await ContactDesc.create({
                description: payload.description
            })

            return response.created({
                status: 200,
                message: 'Description stored successfully!',
                data: desc.serialize()
            })
        }
        catch (err){
            return response.badRequest({
                status: 400,
                message: 'Description not stored',
                err
            })
        }
    }

    public async update({ request, response, auth, params }: HttpContextContract){
        await auth.use('api').authenticate()
        const payload = await request.validate(UpdateContactDescValidator)
        const desc = await ContactDesc.find(params.id)

        if(!desc){
            return response.notFound({
                status: 404,
                message: 'Description not found'
            })
        }

        try {
            await desc.merge(payload).save()
            return response.ok({
                status: 200,
                message: 'Description updated successfully',
                data: desc.serialize()
            })
        }
        catch (err){
            return response.badRequest({
                status: 400,
                message: 'Description not updated',
                err
            })
        }
    }

    public async show({ response }: HttpContextContract){
        const desc = await ContactDesc.all()
        
        if (!desc){
            return response.notFound({
                status: 400,
                message: 'Team not found'
            })
        }

        try {
            return response.ok({
                status: 200,
                message: 'Team retrieved successfully',
                data: desc
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
        const desc = await ContactDesc.find(params.id)

        if (!desc){
            return response.notFound({
                status: 404,
                message: 'Team not found'
            })
        }

        try {
            await desc.delete();
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
