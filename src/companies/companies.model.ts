import {Column, DataType, HasMany, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {User} from "../users/users.model";
import {Tag} from "../tags/tags.model";
import {MapLocation} from "../locations/locations.model";
import {Payment} from "../payment/payment.model";
import {Task} from "../tasks/tasks.model";

// interface UserCreationsAttributes {
//     name: string;
//     password: string;
//     phone: string;
//     type: string;
// }

@Table
export class Company extends Model {

    @ApiProperty({example: '1', description: 'Company unique identificator'})
    @Column(
        {
            type: DataType.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        }
    )
    id: number;

    // @ApiProperty({example: '1', description: "owner identificator"})
    // @Column
    // ownerId: number;

    @ApiProperty({example: 'some.jgp', description: "owner logo"})
    @Column (
        {
            type: DataType.JSON
        }
    )
    logo: Record<string, any>;

    @ApiProperty({example: 'DDD', description: "Company name"})
    @Column
    name: string;

    @ApiProperty({example: true, description: "Does the company have a subscription"})
    @Column
    isSubscribe: boolean;

    @ApiProperty({example: true, description: "Does the company have a trial"})
    @Column
    isTrial: boolean;

    @ApiProperty({example: true, description: "The company already had trial"})
    @Column
    hasTrial: boolean;

    @ApiProperty({example: 111, description: "Trial date"})
    @Column
    trialAt: Date;

    @Column
    ownerId: number;

    @HasMany(() => User, 'companyId')
    users: User[];

    @HasMany(() => Tag)
    tags: Tag[];

    @HasMany(() => MapLocation)
    locations: MapLocation[];

    @HasMany(() => Task)
    tasks: Task[];

}