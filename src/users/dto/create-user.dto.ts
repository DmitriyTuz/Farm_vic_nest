import {ApiProperty} from "@nestjs/swagger";

export class CreateUserDto {

    @ApiProperty({example: 'Alex', description: "Name"})
    readonly name: string;
    @ApiProperty({example: '12345678', description: "Password"})
    readonly password: string;
    @ApiProperty({example: '+100000000001', description: "Phone"})
    readonly phone: string;
    @ApiProperty({example: 'WORKER', description: "Role"})
    readonly type: string;
}