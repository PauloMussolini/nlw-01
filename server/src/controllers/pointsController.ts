import {Request, Response} from 'express';
import knex from '../database/connection';

class pointsController{

    async index (request: Request, response: Response){
        // Filtros cidade, uf, items (request.query)
        const { cidade, uf, items } = request.query;

        const parsedItems = String(items)
        .split(',')
        .map(item => Number(item.trim()));

        const points = await knex('points')
        .join('points_items','points.id', '=', 'points_items.point_id')
        .whereIn('points_items.items_id', parsedItems)
        .where('city', String(cidade))
        .where('uf', String(uf))
        .distinct()
        .select('points.*')


        const serializedPoints = points.map(point => {
        return {
            ... point,
            image_url: `http://10.0.0.8:7777/uploads/${point.image}`,
        }
        });
        return response.json( serializedPoints );
    }

    async show(request: Request, response: Response){
        const { id } = request.params;

        const point = await knex('points').where('id', id).first();
        if (!point){
            return response.status(400).json({ message: 'Point not found!'});
        } 

        const items = await knex('items')
        .join('points_items','items.id', '=', 'points_items.items_id')
        .where('points_items.point_id', id)
        .select('items.title');


        const serializedPoint = {
                ... point,
                image_url: `http://10.0.0.8:7777/uploads/${point.image}`,
            };
        return response.json({ point: serializedPoint, items } );
    }

    async create(request: Request, response: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body;
    
        const trx = await knex.transaction();

        const point = {
            image: request.file.filename,
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        }
    
        const insertedIds = await trx('points').insert(point);
    
        const point_id = insertedIds[0];
    
        const pointItems = items
            .split(',')
            .map((item: string) => Number(item.trim()))
            .map((items_id: number) => {
                                        return{
                                            items_id,
                                            point_id
                                        }

                })
                console.log(pointItems);
        await trx('points_items').insert(pointItems)

        await trx.commit();
    
        return response.json({
            id: point_id,
            ... point,
        });
    }
}

export default pointsController;