import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {User} from "../users/users.model";
import {Task} from "../tasks/tasks.model";

// interface UserCreationsAttributes {
//     name: string;
//     password: string;
//     phone: string;
//     type: string;
// }

@Table
export class CompleteTask extends Model {

    @Column(
        {
            type: DataType.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        }
    )
    id: number;

    @Column
    comment: string;

    @Column
    timeLog: string;

    @Column({type: DataType.ARRAY(DataType.JSON), defaultValue: []})
    mediaInfo: Record<string, any>[];

    @ForeignKey(() => User)
    @Column
    userId: number;

    @ForeignKey(() => Task)
    @Column
    taskId: number;

    @BelongsTo(() => User)
    user: User;

    @BelongsTo(() => Task)
    task: Task

}