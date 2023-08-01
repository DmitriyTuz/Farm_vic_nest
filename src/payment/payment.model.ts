import {BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {Company} from "../companies/companies.model";
import {User} from "../users/users.model";


// interface PaymentCreationAttrs {
//     name: string;
//     password: string;
//     phone: string;
//     type: string;
// }

@Table
export class Payment extends Model/*<Payment, PaymentCreationAttrs>*/ {

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

    @Column ({ type: DataType.STRING })
    cardType: string;

    @Column ({ type: DataType.STRING })
    customerId: string;

    @Column ({ type: DataType.STRING })
    expiration: string;

    @Column ({ type: DataType.STRING })
    nameOnCard: string;

    @Column ({ type: DataType.STRING })
    number: string;

    @Column ({ type: DataType.STRING })
    prefer: string;

    @Column ({ type: DataType.STRING })
    subscriberId: string;

    @Column ({ type: DataType.DATE })
    paidAt: Date;

    @Column ({ type: DataType.BOOLEAN })
    agree: boolean;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    userId: number;

    @BelongsTo(() => User)
    owner: User;

}