import { NumberValueAccessor } from "@angular/forms";
import { User } from "./user";

export interface AllUsers {
    totalRecords: number;
    totalPages: number;
    records: User[];
}