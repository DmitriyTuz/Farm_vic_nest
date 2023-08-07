import {BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {Company} from "../companies/companies.model";
import {TaskLocations} from "../tasks/task-locations.model";
import {Task} from "../tasks/tasks.model";

// interface UserCreationsAttributes {
//     name: string;
//     password: string;
//     phone: string;
//     type: string;
// }

@Table
export class MapLocation extends Model {

    @ApiProperty({example: '1', description: 'Location unique identificator'})
    @Column(
        {
            type: DataType.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        }
    )
    id: number;

    @ApiProperty({example: 'Location 1', description: "Location name"})
    @Column
    name: string;

    @ApiProperty({example: 'lat 1', description: "Location lat"})
    @Column({ type: DataType.DECIMAL })
    lat: number

    @ApiProperty({example: 'lat 1', description: "Location lng"})
    @Column({ type: DataType.DECIMAL })
    lng: number

    @ForeignKey(() => Company)
    @Column
    companyId: number;

    @BelongsTo(() => Company)
    company: Company;

    @BelongsToMany(() => Task, () => TaskLocations)
    tasks: Task[];

}
