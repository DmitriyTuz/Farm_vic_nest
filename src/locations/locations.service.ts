import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {MapLocation} from "./locations.model";
import {LocationAttributes} from "../interfaces/location-attributes";
import {Op} from "sequelize";

@Injectable()
export class LocationsService {

    constructor(@InjectModel(MapLocation) private locationRepository: typeof MapLocation) {}

    async getAll(user) {
        try {
            const locations = await this.getAllLocations({companyId: user.companyId});
            const returningLocations = locations.map((location) => ({
                lat: +location.lat,
                lng: +location.lng,
            }));
            const response = {
                success: true,
                data: {locations: returningLocations}
            };

            return response
        } catch (err) {
            throw err;
        }
    }

    async getAllLocations({companyId}) {
        const query: any = {
            attributes: ['id', 'lat', 'lng'],
            where: {}
        };

        if (companyId) {
            query.where.companyId = companyId;
        }

        const locations = await this.locationRepository.findAll(query);
        return locations as LocationAttributes[];
    }

    async getOneLocation({lng, lat}, companyId) {
        const query  = {lng, lat, companyId}
        if (companyId) {
            query.companyId = companyId;
            query.companyId = companyId;
        }

        return this.locationRepository.findOrCreate({
            where: query,
            defaults: query,
        });
    }

    async checkLocations(model, locations) {
        try {
            const p = [];
            const s = [];
            for (const l of locations) {
                s.push(this.getOneLocation(l, model.companyId));
            }

            const result = await Promise.all(s);
            locations = result.map(r => r[0]);
            const taskLocations = model?.mapLocation?.length ? model.mapLocation.map(l => `${l.id} ${l.lat} ${l.lng}`) : [];

            for (let l of locations) {
                if (l) {
                    const id = `${l.id} ${l.lat} ${l.lng}`;
                    if (!taskLocations.includes(id)) {
                        p.push(model.addMapLocation(l));
                    }

                    if (taskLocations.includes(id)) {
                        taskLocations.splice(taskLocations.indexOf(id), 1);
                    }
                }
            }

            let unassignedLocations = [];

            if (taskLocations.length) {
                const ids = [];
                for (let t of taskLocations) {
                    ids.push(+t.split(' ')[0]);
                }

                unassignedLocations = await this.locationRepository.findAll({
                    where: {id : {[Op.in]: ids}}
                });

                if (unassignedLocations.length) {
                    for (const l of unassignedLocations) {
                        p.push(model.removeMapLocation(l));
                    }
                }
            }

            await Promise.all(p);

            if (unassignedLocations?.length) {
                for (const l of unassignedLocations) {
                    if (await l.countTasks()) {
                        await l.destroy();
                    }
                }
            }
        } catch (e) {
            throw (e);
        }
    }
}
