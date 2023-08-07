import {BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {Company} from "../companies/companies.model";
import {UserTags} from "./user-tags.model";
import {User} from "../users/users.model";
import {TaskTags} from "../tasks/task-tags.model";
import {Task} from "../tasks/tasks.model";

// interface UserCreationsAttributes {
//     name: string;
//     password: string;
//     phone: string;
//     type: string;
// }

@Table
export class Tag extends Model {

    @ApiProperty({example: '1', description: 'Tag unique identificator'})
    @Column(
        {
            type: DataType.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        }
    )
    id: number;

    @ApiProperty({example: 'WORKER', description: "Tag name"})
    @Column
    name: string;

    @ForeignKey(() => Company)
    @Column({
        // allowNull: false,
    })
    companyId: number;

    @BelongsTo(() => Company)
    company: Company;

    @BelongsToMany(() => User, () => UserTags)
    users: User[];

    @BelongsToMany(() => Task, () => TaskTags)
    tasks: Task[];



}