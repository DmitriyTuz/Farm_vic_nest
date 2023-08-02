import { Injectable } from '@nestjs/common';
import {TagOptions} from "../interfaces/tag-options.interface";
import {Tag} from "./tags.model";
import {InjectModel} from "@nestjs/sequelize";
import {Op} from 'sequelize';
import {UsersService} from "../users/users.service";
import _ from "underscore";

@Injectable()
export class TagsService {

    constructor(@InjectModel(Tag) private tagRepository: typeof Tag,
                private userService: UsersService) {}

    async getAll(tagOptions, currentUserId, res) {
        try {
        const user = await this.userService.getOneUser({id: currentUserId});

        let {names, search} = tagOptions;
        const {companyId} = user;

        if (typeof names === 'string') {
            names = [names.toLowerCase()];
        }

        const tags = await this.getAllTags({names, action: 'GetAll', search, companyId});
        const returnedTags = [];

        for (const t of tags) {
            returnedTags.push(await this.getTagData(t))
        }

        return res.status(200).send({
            success: true,
            data: {tags: returnedTags}
        });
        } catch (err) {
            throw err;
        }
    }

    async getTagData(tag) {
        const data = _.pick(tag, ['id', 'name']);
        data.name = this.capitalize(data.name);
        return data;
    }

   private capitalize(s: string, camelCase: boolean = false) {
        if (typeof s === 'string') {
            let result = s.charAt(0).toUpperCase();
            if (camelCase) {
                result = result + s.slice(1).toLowerCase();
            } else {
                result = result + s.slice(1);
            }
            return result;
        } else {
            return '';
        }
    }

    async getAllTags({ names, action, search, companyId }: TagOptions) {
        const query: any = {
            attributes: ['id', 'name'],
            order: [['name', 'ASC']],
            where: {},
        };

        if (companyId) {
            query.where.companyId = companyId;
        }

        if (action === 'GetAll') {
            if (names?.length) {
                names = names.map((n) => n.toLowerCase());
            }

            query.limit = 10;
            query.where.name = { [Op.notIn]: names || [] };
            query.where[Op.or] = [{ name: { [Op.iLike]: `%${search}%` } }];
        }

        return this.tagRepository.findAll(query);
    }

}
