import {
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from "sequelize-typescript";
import {Task} from "./tasks.model";
import {MapLocation} from "../locations/locations.model";

@Table({ tableName: "TaskLocations"})
export class TaskLocations extends Model {
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

    @ForeignKey(() => MapLocation)
    @Column
    locationId: number;
}