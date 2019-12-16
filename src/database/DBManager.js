import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';

export class DBManager {

    db = SQLite.openDatabase("db.db");
    // directory = FileSystem.documentDirectory + "shortcutme";
    // filePath = this.directory + "/shortcutme.txt"


    constructor() {
        this.init();
    }

    addOrUpdateItem(item) {
        this.db.transaction(tx => {
            tx.executeSql(
                "insert or replace into items (id, name, url) values (?, ?, ?);", [item.id, item.name.trim(), item.url],
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

    // async exportDatabase() {

    //     const dir = await FileSystem.getInfoAsync(this.directory);
    //     if(!dir.exists) {
    //         FileSystem.makeDirectoryAsync(this.directory)
    //     }

    //     let content = '{"db":{ "items":[';

    //     this.getItems((items) => {
    //         items.forEach(item => {
    //             content += '{"id": "' + item.id + '", "name":"' + item.name + '", "url":"' + item.url + '"},'
    //         });
    //         content = content.slice(0, -1); //removing comma
    //         content += ']}}';

    //         FileSystem.writeAsStringAsync(this.filePath, content);
    //     });
    // }

    // importDatabase() {
    //     return FileSystem.readAsStringAsync(this.filePath)
    //         .then(result => {
    //             const database = JSON.parse(result);
    //             database.db.items.forEach(item => {
    //                 this.addOrUpdateItem(item);
    //             });
    //         })
    //         .catch(error => console.log("error", error));
    // }

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