import { Injectable } from '@nestjs/common';
import {UsersService} from "../users/users.service";
import {InjectModel} from "@nestjs/sequelize";
import {User} from "../users/users.model";
import {MapLocation} from "./locations.model";
import {LocationAttributes} from "../interfaces/location-attributes";

@Injectable()
export class LocationsService {

    constructor(@InjectModel(MapLocation) private locationRepository: typeof MapLocation,
                private userService: UsersService) {}

    async getAll(currentUserId) {
        try {
            const user = await this.userService.getOneUser({id: currentUserId});

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
}
