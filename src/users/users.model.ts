import {Column, DataType, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";

interface UserCreationsAttributes {
    name: string;
    password: string;
    phone: string;
    type: string;
}

@Table
export class User extends Model<User, UserCreationsAttributes> {

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

    @Column
    lastActive: Date;
}