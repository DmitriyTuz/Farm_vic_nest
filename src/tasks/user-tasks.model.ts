import {
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from "sequelize-typescript";
import {User} from "../users/users.model";
import {Task} from "./tasks.model";

@Table({ tableName: "UserTasks"})
export class UserTasks extends Model {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ForeignKey(() => User)
    @Column
    userId: number;

    @ForeignKey(() => Task)
    @Column
    taskId: number;
}