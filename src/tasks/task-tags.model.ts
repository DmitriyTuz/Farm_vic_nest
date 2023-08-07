import {
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from "sequelize-typescript";
import {Task} from "./tasks.model";
import {Tag} from "../tags/tags.model";

@Table({ tableName: "TaskTags"})
export class TaskTags extends Model {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ForeignKey(() => Task)
    @Column
    taskId: number;

    @ForeignKey(() => Tag)
    @Column
    tagId: number;
}