/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'MIR Game Studio is here!' }
})

Route.group(() => {
  Route.group(() => {
    Route.post('/login', 'AuthController.login')
    Route.post('/register', 'AuthController.register')
  }).prefix('/auth')

  Route.group(() => {
    Route.get('/', 'ArticlesController.paginate')
    Route.get('/:slug', 'ArticlesController.findBySlug')
    Route.put('/:id', 'ArticlesController.update').middleware('ImageUpload:thumbnail')
    Route.post('/', 'ArticlesController.store').middleware('ImageUpload:thumbnail')
    Route.delete('/:id', 'ArticlesController.delete')
  }).prefix('/articles')

  Route.group(() => {
    Route.get('/', 'TeamsController.show')
    Route.post('/', 'TeamsController.store').middleware('ImageUpload:image')
    Route.put('/:id', 'TeamsController.update')
    Route.delete('/:id', 'TeamsController.delete')
  }).prefix('/teams')

  Route.group(() => {
    Route.get('/', 'PortfoliosController.paginate')
    Route.post('/', 'PortfoliosController.store').middleware('ImageUpload:thumbnail')
    Route.put('/:id', 'PortfoliosController.update').middleware('ImageUpload:thumbnail')
    Route.delete('/:id', 'PortfoliosController.delete')
  }).prefix('/portfolios')

  Route.group(() => {
    Route.get('/', 'ContactsController.show')
    Route.post('/', 'ContactsController.store')
    Route.put('/:id', 'ContactsController.update')
    Route.delete('/:id', 'ContactsController.delete')
  }).prefix('/contacts')

  Route.group(() => {
    Route.get('/', 'ContactDescsController.show')
    Route.post('/', 'ContactDescsController.store')
    Route.put('/:id', 'ContactDescsController.update')
    Route.delete('/:id', 'ContactDescsController.delete')
  }).prefix('/contact-desc')
}).prefix('/api')
