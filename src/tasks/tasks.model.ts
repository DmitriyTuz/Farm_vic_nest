import {BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {Company} from "../companies/companies.model";
import {TaskStatuses} from "../lib/constants";
import {User} from "../users/users.model";
import {UserTags} from "../tags/user-tags.model";
import {UserTasks} from "./user-tasks.model";
import {Tag} from "../tags/tags.model";
import {TaskTags} from "./task-tags.model";
import {MapLocation} from "../locations/locations.model";
import {TaskLocations} from "./task-locations.model";

// interface UserCreationsAttributes {
//     name: string;
//     password: string;
//     phone: string;
//     type: string;
// }

@Table
export class Task extends Model {

    @ApiProperty({example: '1', description: 'Task unique identificator'})
    @Column(
        {
            type: DataType.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        }
    )
    id: number;

    @ApiProperty({example: 'Task 1', description: "Task title"})
    @Column
    title: string;

    @ApiProperty({example: 'Low, Medium or High', description: "Task type"})
    @Column
    type: string

    @ApiProperty({example: '1', description: "Task execution time"})
    @Column
    executionTime: number

    @ApiProperty({example: 'Any comment', description: "Task comment"})
    @Column
    comment: string

    @ApiProperty({example: '[{id:1, name: 1.jpg}, {id:2, name: 2.jpg}]', description: "Task media info"})
    @Column({type: DataType.ARRAY(DataType.JSON), defaultValue: []})
    mediaInfo: Record<string, any>[];

    @ApiProperty({example: '[{id:1, name: 1.txt}, {id:2, name: 2.txt}]', description: "Task media info"})
    @Column({type: DataType.ARRAY(DataType.JSON), defaultValue: []})
    documentsInfo: Record<string, any>[];

    @ApiProperty({example: 'Active, Waiting or Completed', description: "Task status"})
    @Column({defaultValue: TaskStatuses.ACTIVE})
    status: string;

    @ApiProperty({example: 'Active, Waiting or Completed', description: "Task status"})
    @Column
    completedAt: Date;

    @ForeignKey(() => User)
    @Column
    userId: number;

    @ForeignKey(() => Company)
    @Column
    companyId: number;

    @BelongsTo(() => User)
    creator: User;

    @BelongsToMany(() => User, () => UserTasks)
    workers: User[];

    @BelongsTo(() => Company)
    company: Company;

    @BelongsToMany(() => Tag, () => TaskTags)
    tags: Tag[];

    @BelongsToMany(() => MapLocation, () => TaskLocations)
    mapLocation: MapLocation[];

}
