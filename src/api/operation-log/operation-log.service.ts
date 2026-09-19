import { Types } from "mongoose";
import { OperationLogModel } from "./operation-log.model";
import { TipoOperazione } from "./operation-log.entity";

async function registra(
    tipoOperazione: TipoOperazione,
    esito: boolean,
    ip: string,
    contoCorrenteId?: string | Types.ObjectId
) {
    await OperationLogModel.create({ tipoOperazione, esito, ip, contoCorrenteId });
}

export default { registra };