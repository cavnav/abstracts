import { v4 as uuidv4 } from 'uuid';

export interface IIdGenerator {
    nextId(): string;
}

export class UuidGenerator implements IIdGenerator {
    nextId(): string {
        return uuidv4();
    }
}
