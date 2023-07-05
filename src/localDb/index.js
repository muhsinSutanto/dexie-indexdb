import Dexie from "dexie";
import { tableName } from "./tableName";

export const db = new Dexie("myDatabase");
db.version(3).stores(tableName);
