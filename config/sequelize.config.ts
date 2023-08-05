import { SequelizeOptions } from 'sequelize-typescript';
import {User} from "../src/users/users.model";
import {Tag} from "../src/tags/tags.model";
import {UserTags} from "../src/tags/user-tags.model";

const sequelizeConfig: SequelizeOptions = {
    database: process.env.POSTGRES_DB,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: +process.env.POSTGRES_PORT,
    dialect: 'postgres',
    models: [User, Tag, UserTags],
    logging: false,

};

export default sequelizeConfig;