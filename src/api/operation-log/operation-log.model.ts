//salva i dati (
// 1. chi (quale conto corrente, se identificabile)
// 2.quando (data e ora), 3. da dove (indirizzo IP)
// 4.come è andata (riuscito o fallito))
// dei tentativi delle operazioni  (login, ricarica, bonifico e cambio password) a db
import { model, Schema } from "mongoose";
import { OperationLog } from "./operation-log.entity";

const operationLogSchema = new Schema<OperationLog>({
    contoCorrenteId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    tipoOperazione: {
        type: String,
        enum: ['Login', 'Ricarica', 'Bonifico', 'CambioPassword'],
        required: true
    },
    ip: { type: String, required: true },
    data: { type: Date, default: Date.now },
    esito: { type: Boolean, required: true }
});

export const OperationLogModel = model<OperationLog>('OperationLog', operationLogSchema);