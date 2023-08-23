import { Injectable } from '@nestjs/common';
import {TagOptions} from "../interfaces/tag-options.interface";
import {Tag} from "./tags.model";
import {InjectModel} from "@nestjs/sequelize";
import {Op} from 'sequelize';
import _ from "underscore";

@Injectable()
export class TagsService {

    constructor(@InjectModel(Tag) private tagRepository: typeof Tag) {}

    async getAll(tagOptions, user, res) {
        try {

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

    async checkTags(model, tags) {
        const p = [];
        const s = [];

        for (const t of tags) {
            s.push(await this.getOneTag({name: t.toLowerCase(), companyId: model.companyId}));
        }

        const resolve = await Promise.all(s);
        tags = resolve.map(r => r[0]);

        // tags = s.map(r => r[0]);

        let userTagNames = model?.tags?.length ? model.tags.map(t => t.name) : [];

        for (const t of tags) {
            if (!userTagNames.includes(t.name)) {
                p.push(model.addTag(t))
            }

            if (userTagNames.includes(t.name)) {
                userTagNames.splice(userTagNames.indexOf(t.name), 1);
            }
        }

        if (userTagNames.length) {
            for (const tagName of userTagNames) {
                const tag = model.tags.find(t => t.name === tagName);
                p.push(model.removeTag(tag));
            }
        }
        await Promise.all(p);
    }

    async getOneTag(findQuery) {
        return this.tagRepository.findOrCreate({attributes: ['id', 'name'], where: findQuery});
    }

}
