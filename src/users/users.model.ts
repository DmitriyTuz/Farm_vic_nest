import {BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {Company} from "../companies/companies.model";
import {Tag} from "../tags/tags.model";
import {UserTags} from "../tags/user-tags.model";
import {Payment} from "../payment/payment.model";
import {Task} from "../tasks/tasks.model";

// interface UserCreationAttrs {
//     name: string;
//     password: string;
//     phone: string;
//     type: string;
// }

@Table
export class User extends Model/*<User, UserCreationAttrs>*/ {

    @ApiProperty({example: '1', description: 'User unique identificator'})
    @Column(
        {
        type: DataType.INTEGER,
        unique: true,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    }
)
    id: number;

    @ApiProperty({example: 'Alex', description: "User name"})
    @Column
    name: string;

    @ApiProperty({example: '12345678', description: "User password"})
    @Column
    password: string;

    @ApiProperty({example: '+100000000001', description: "User phone"})
    @Column
    phone: string;

    @ApiProperty({example: 'WORKER', description: "User role"})
    @Column
    type: string;

    @Column({ type: DataType.DATE })
    lastActive: Date;

    @ForeignKey(() => Company)
    @Column({ type: DataType.INTEGER })
    companyId: number;

    @BelongsTo(() => Company, { foreignKey: 'companyId' })
    company: Company;

    @BelongsToMany(() => Tag, () => UserTags)
    tags: Tag[];

    @HasMany(() => Payment)
    payments: Payment[];

    @HasMany(() => Task)
    tasks: Task[];

}