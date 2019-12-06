import * as SQLite from 'expo-sqlite';
// import uuid from 'react-native-uuid';

export class DBManager {

    db = SQLite.openDatabase("db.db");


    constructor() {
        this.init();
    }

    addOrUpdateItem(item) {
        this.db.transaction(tx => {
            tx.executeSql(
                "insert or replace into items (id, name, url) values (?, ?, ?);", [item.id, item.name, item.url],
                (_, { rows }) => console.log('add ok', JSON.stringify(rows)),
                (_, { error }) => console.log('add error', JSON.stringify(error)),
            );
        });
    }

    getItems(callbackfn) {
        if (callbackfn)
            this.db.transaction(tx => {
                tx.executeSql(
                    "select * from items;", [],
                    (_, { rows }) => { callbackfn(rows._array) },
                    (_, { error }) => console.log('get error', JSON.stringify(error)),
                );
            });
    }

    updateItem(item) {

    }

    deleteItem(item) {
        this.db.transaction(tx => {
            tx.executeSql(
                "delete from items where id = ?;", [item.id],
                (_, { rows }) => console.log('del ok', JSON.stringify(rows)),
                (_, { error }) => console.log('del error', JSON.stringify(error)),
            );
        });
    }

    init() {
        this.db.transaction(tx => {
            tx.executeSql(
                "create table if not exists items (id text primary key not null, name text, url text);", [],
                (_, { rows }) => console.log('create success', JSON.stringify(rows)),
                (_, { error }) => console.log('create error', JSON.stringify(error)),
            );
        });
    }

}