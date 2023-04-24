import {Column, DataType, Model, Table} from "sequelize-typescript";

interface UserCreationsAttributes {
    name: string;
    password: string;
    phone: string;
    type: string;
}

@Table
export class User extends Model<User, UserCreationsAttributes> {

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

    @Column
    name: string;

    @Column
    password: string;

    @Column
    phone: string;

    @Column
    type: string;

    @Column
    lastActive: Date;
}