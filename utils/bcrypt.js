
import bcrypt from 'bcrypt';
import { randomInt } from 'node:crypto';

const randomSalt = randomInt(10, 16);
 
export async function gerarHash(senha) {
    return await bcrypt.hash(senha, randomSalt);
}

export async function compararHash(senhaDigitada, hashDoBanco) {
    return await bcrypt.compare(senhaDigitada, hashDoBanco);
}