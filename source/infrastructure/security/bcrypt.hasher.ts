import bcrypt from "bcrypt"

export class BcryptHasher {
    private SALT = 10;

    async hash(password: string): Promise<string> {
        return bcrypt.hash(password, this.SALT);
    }

    async compare(plain: string, hashed: string): Promise<boolean> {
        return bcrypt.compare(plain, hashed)
    }
}