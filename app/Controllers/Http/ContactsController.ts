import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Contact from 'App/Models/Contact'
import ContactValidator from 'App/Validators/ContactValidator'
import UpdateContactValidator from 'App/Validators/UpdateContactValidator'

export default class ContactsController {
    public async store({ request, response, auth }: HttpContextContract){
        await auth.use('api').authenticate()
        const payload = await request.validate(ContactValidator)
        
        try {
            const contact = await Contact.create({
                platform: payload.platform,
                content: payload.content
            })

            return response.created({
                status: 201,
                message: 'Contact stored successfully',
                data: contact.serialize()
            })
        }
        catch (err){
            return response.badRequest({
                status: 400,
                message: 'Contact not stored!',
                err
            })
        }
    }

    public async update({ request, response, params, auth }: HttpContextContract){
        await auth.use('api').authenticate()
        const payload = await request.validate(UpdateContactValidator)

        const contact = await Contact.find(params.id)
        if (!contact){
            return response.notFound({
                status: 400,
                message: 'Contact not found'
            })
        }
        
        try {
            await contact.merge(payload).save()
            return response.ok({
                status: 200,
                message: 'Contact updated',
                data: contact.serialize()
            })
        }
        catch (err){
            return response.badRequest({
                status: 400,
                message: 'Contact not updated',
                err
            })
        }
    }

    public async show({ response }: HttpContextContract){
        const contact = await Contact.all()

        if (!contact){
            return response.notFound({
                status: 400,
                message: 'Contact not found'
            })
        }

        try {
            return response.ok({
                status: 200,
                message: 'Contact retrieved successfully',
                data: contact
            })
        }
        catch (err){
            return response.badGateway({
                status: 500,
                message: 'Contact not retrieved',
                err
            })
        }
    }

    public async delete({ response, params, auth }: HttpContextContract){
        await auth.use('api').authenticate()
        const contact = await Contact.find(params.id)

        if(!contact){
            return response.notFound({
                status: 400,
                message: 'Contact not found'
            })
        }

        try {
            await contact.delete()
            return response.ok({
                status: 200,
                message: 'Contact delete successfully'
            })
        }
        catch (err){
            return response.badGateway({
                status: 500,
                message: 'Contact not deleted',
                err
            })
        }
    }
}
