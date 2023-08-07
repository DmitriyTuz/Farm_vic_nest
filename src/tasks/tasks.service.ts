import { Injectable } from '@nestjs/common';
import {UsersService} from "../users/users.service";
import {TaskStatuses, TaskTypes, UserTypes} from "../lib/constants";
import {Op} from "sequelize";
import {Task} from "./tasks.model";
import {User} from "../users/users.model";
import {MapLocation} from "../locations/locations.model";
import {Tag} from "../tags/tags.model";
import {HelpersService} from "../lib/helpers/helpers.service";
import _ from "underscore";
const moment = require("moment/moment");
// import moment from "moment/moment";

@Injectable()
export class TasksService {

    constructor(private userService: UsersService,
                private helperService: HelpersService) {}

    async getAll(reqBody, currentUserId, res) {
        try {
            const user = await this.userService.getOneUser({id: currentUserId});
            let userId = 0;

            if (user.type === UserTypes.WORKER) {
                userId = user.id;
            }

            const {companyId} = user;

            const {status, date, type, location, tags} = reqBody
            const tasks = await this.getAllTasks({status, date, type, location, tags, companyId, userId});

            let returnedTasks = [];

            for (const t of tasks) {
                returnedTasks.push(this.getTaskData(t));
            }

            returnedTasks = returnedTasks.sort((a, b) => {
                const dateDiffA = moment(date).diff(moment(a.dueDate), 'days');
                const dateDiffB = moment(date).diff(moment(b.dueDate), 'days');

                return dateDiffA === 0 ? -1 : dateDiffB === 0 ? 1 : 0;
            });

            // console.log('returnedTasks = ', returnedTasks)

            const filterCounts = await this.getFilterCount(companyId, userId, status);

            // const response = {
            //     success: true,
            //     data: {tasks: returnedTasks, filterCounts}
            // };

            // console.log('response = ', response)

            return res.status(200).send({
                success: true,
                data: {tasks: returnedTasks, filterCounts}
            });
        } catch (err) {
            throw err;
        }
    }

    async getAllTasks(reqBody) {
        const queryWorkers =  {
            attributes: ['id', 'name', 'type'],
            model: User,
            as: 'workers',
            through: {attributes: []},
            where: {},
            required: false
        };

        if (reqBody.userId) {
            queryWorkers.where = {id: reqBody.userId};
            queryWorkers.required = true;
        }

        const query: any = {
            attributes: this.helperService.getModelFields(Task, [], true, true, 'Task'),
            where: {},
            include: [
                // {
                //     attributes: this.helperService.getModelFields(ReportTask, [], true, true, 'reportInfo'),
                //     model: ReportTask,
                //     as: 'reportInfo',
                //     include: [{
                //         attributes: ['id', 'name', 'createdAt'],
                //         model: User,
                //         as: 'user'
                //     }]
                // },
                // {
                //     attributes: getModelFields(CompleteTask, [], true, true, 'completeInfo'),
                //     model: CompleteTask,
                //     as: 'completeInfo',
                //     include: [{
                //         attributes: ['id', 'name', 'createdAt'],
                //         model: User,
                //         as: 'user'
                //     }]
                // },
                {
                    attributes: this.helperService.getModelFields(User, ['password'], true, true, 'creator'),
                    model: User,
                    as: 'creator',
                },
                {
                    attributes: ['id', 'name'],
                    model: Tag,
                    as: 'tags',
                    through: {attributes: []}
                },
                queryWorkers,
                {
                    model: MapLocation,
                    as: 'mapLocation',
                    through: {attributes: []}
                },
            ],
            order: [
                ['dueDate', 'ASC'],
            ]
        };

        if (reqBody.companyId) {
            query.where.companyId = reqBody.companyId;
        }

        if (reqBody.status) {
            query.where.status = reqBody.status;
        } else  if (reqBody.userId) {
            query.where.status = {[Op.ne]: TaskStatuses.WAITING};
        }

        if (reqBody.type && reqBody.type !== 'All') {
            query.where.type = reqBody.type;
        }

        // if (date) {
        // query.where.createdAt = {
        //     [Op.lte]: moment(date, 'x').add(1, 'day').endOf('day').toDate()
        // }
        // }

        if (reqBody.tags?.length) {
            const ids = reqBody.tags.map(t => t.id);
            if (!query.include[3].where) query.include[3].where = {};
            query.include[3].where = {id: {[Op.in]: ids}};
            query.include[3].required = true;
        }

        if (reqBody.location) {
            const {lat, lng} = reqBody.location;
            if (!query.include[5].where) query.include[5].where = {};
            query.include[5].where = {lat: lat, lng: lng};
            query.include[5].required = true;
        }

        return Task.findAll(query);
    }

    getTaskData(task) {
        const data = _.pick(task, ['id', 'title', 'mapLocation', 'type', 'executionTime', 'comment', 'mediaInfo', 'documentsInfo', 'status', 'workers', 'tags', 'completeInfo', 'reportInfo', 'creator', 'createdAt', 'updatedAt', 'completedAt', 'dueDate']);
        data.createdAt = data.createdAt ? parseInt(data.createdAt) : null;
        data.updatedAt = data.updatedAt ? parseInt(data.updatedAt) : null;
        data.completedAt = data.completedAt ? parseInt(data.completedAt) : null;

        if (task?.completeInfo?.length) {
            data.completeInfo = [];
            for (const c of task.completeInfo) {
                c.dataValues.createdAt = c.dataValues.createdAt ? parseInt(c.dataValues.createdAt) : null;
                c.dataValues.updatedAt = c.dataValues.updatedAt ? parseInt(c.dataValues.updatedAt) : null;

                data.completeInfo.push(c.dataValues);
            }
        }

        if (task?.reportInfo?.length) {
            data.reportInfo = [];
            for (const c of task.reportInfo) {
                c.dataValues.createdAt = c.dataValues.createdAt ? parseInt(c.dataValues.createdAt) : null;
                c.dataValues.updatedAt = c.dataValues.updatedAt ? parseInt(c.dataValues.updatedAt) : null;

                data.reportInfo.push(c.dataValues);
            }
        }

        if (data?.mapLocation?.length) {
            const returningLocations = [];
            for (let m of data.mapLocation) {
                returningLocations.push({
                    lat: +m.lat,
                    lng: +m.lng,
                })
            }

            data.mapLocation = returningLocations;
        }

        return data;
    }

    async getFilterCount(companyId, userId, status) {
        const tasks = await this.getAllTasks({companyId, userId, status});

        const groupTasks = _.groupBy(tasks, 'type');

        const filterCounts = {
            low: groupTasks[TaskTypes.LOW]?.length || 0,
            medium: groupTasks[TaskTypes.MEDIUM]?.length || 0,
            high: groupTasks[TaskTypes.HIGH]?.length || 0,
            all: 0
        }

        filterCounts.all = filterCounts.low + filterCounts.medium + filterCounts.high;
        return filterCounts;
    }
}
