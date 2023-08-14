import {Column, DataType, Model, Table} from "sequelize-typescript";

@Table
export class Plan extends Model {

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
    stripeId: string;

    @Column
    name: string;

    @Column
    amount: number;

    @Column
    currency: string;

    @Column
    interval: string;

    @Column
    active: string;

}