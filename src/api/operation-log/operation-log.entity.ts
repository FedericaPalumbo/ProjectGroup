//questo file è la "forma" del dato: dice che ogni riga del registro avrà un tipo di operazione, un IP, una data e un esito.
import { Types } from "mongoose";

export type TipoOperazione = 'Login' | 'Ricarica' | 'Bonifico' | 'CambioPassword';

export type OperationLog = {
    id: string;
    /** assente se l'utente non è stato identificato (es. login con email inesistente) */
    contoCorrenteId?: Types.ObjectId;
    tipoOperazione: TipoOperazione;
    ip: string;
    data: Date;
    esito: boolean;
}