
import Database from '../db/database.js'
const banco = new Database();

export default class UserModel {
    #usuID;
    #usuNome;
    #usuEmail;
    #usuSenha;
    #usuAtivo;

    get usuID() { return this.#usuID; } set usuID(value) { this.#usuID = value; }
    get usuNome() { return this.#usuNome; } set usuNome(value) { this.#usuNome = value; }
    get usuEmail() { return this.#usuEmail; } set usuEmail(value) { this.#usuEmail = value; }
    get usuSenha() { return this.#usuSenha; } set usuSenha(value) { this.#usuSenha = value; }
    get usuAtivo() { return this.#usuAtivo; } set usuAtivo(value) { this.#usuAtivo = value; }

    constructor(usuID, usuNome, usuEmail, usuSenha, usuAtivo) {
        this.#usuID = usuID;
        this.#usuNome = usuNome;
        this.#usuEmail = usuEmail;
        this.#usuSenha = usuSenha;
        this.#usuAtivo = usuAtivo;
    }

    async logar(email, senha) {
        const sql = "SELECT * FROM TB_USUARIO WHERE USU_EMAIL = ? AND USU_SENHA = ?";
        const valores = [email, senha];
        const result = await banco.ExecutaComando(sql, valores);

        if(result.length > 0) {
            let row = result[0];
            return new UserModel(row["USU_ID"], row["USU_NOME"], row["USU_EMAIL"], row["USU_SENHA"], row["USU_ATIVO"]);
        }
        return null;
    }

    async register() {
        const sql = "INSERT INTO TB_USUARIO (USU_ID, USU_NOME, USU_EMAIL, USU_SENHA) VALUES (?, ?, ?, ?)";
        const valores = [this.#usuID, this.#usuNome, this.#usuEmail, this.#usuSenha];
        const result = await banco.ExecutaComandoNonQuery(sql, valores);
        return result;
    }

}