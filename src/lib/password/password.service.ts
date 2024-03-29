import { Injectable } from '@nestjs/common';
const bcrypt = require('bcrypt');
const generator = require('generate-password');

@Injectable()
export class PasswordService {

    async checkPassword(user, userData) {
        try {
            if (!user.password) {
                user = await this.addNewPassword(user, userData.password);
            }
            return user;
        } catch (err) {
            throw (err);
        }
    };

    async addNewPassword(user, password) {
        try {
            let hash = await this.hashNewPassword('', password);

            if (!hash) {
                throw ({ status: 422, message: '422-the-new-password-is-the-same-as-an-existing', stack: new Error().stack });
            }

            user = await user.update({ password: hash });
            return user;
        } catch (err) {
            throw (err);
        }
    };

    async hashNewPassword(currentPassword, newPassword) {
        try {
            let hash = null;

            if (currentPassword !== newPassword) {
                let salt = await bcrypt.genSalt(10);
                hash = await bcrypt.hash(newPassword, salt);
            }

            return hash;
        } catch (err) {
            throw (err);
        }
    };

    async validPassword(password, userPassword) {
        let check = false;

        if (password) {
            check = await bcrypt.compareSync(password, userPassword);
        }

        return check;
    };

    createPassword() {
        return generator.generate({
            length: 10,
            numbers: true
        });
    }

    async hashPassword(password) {
        try {
            let salt = await bcrypt.genSalt(10);
            return await bcrypt.hash(password, salt);
        } catch (err) {
            throw (err);
        }
    };
}
