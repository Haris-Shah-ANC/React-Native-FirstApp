import React, { useState, useEffect, useRef } from "react";
import { View, Text, Dimensions, TextInput, Button, StyleSheet, ScrollView } from "react-native";
import { Table, Row } from 'react-native-table-component';
// import { enablePromise, openDatabase, SQLiteDatabase, db ,SQLite} from 'react-native-sqlite-storage';
import { openDatabase } from "react-native-sqlite-storage";
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
    {
        name: "rn_sqlite",
        location: 'default',
    },
    () => {},
    error => {console.log("error connecting to database",error)}
  );


export default function LinkWithSQLite() {

    // const [inputText, setInputText] = useState('');

    // const handleTextInputChange = (text) => {
    //     setInputText(text);
    // };

    // useEffect(() => {
    //     createTables()
    // }, [])

    // const createTables = () => {
    //     db.transaction(txn => {
    //         txn.executeSql(
    //             `CREATE TABLE IF NOT EXISTS graph_data (data VARCHAR(20))`,
    //             [],
    //             (sqlTxn, res) => {
    //                 console.log("table created successfully");
    //             },
    //             error => {
    //                 console.log("error on creating table " + error.message);
    //             },
    //         );
    //     });
    // };


    // const handleFormSubmit = () => {

    //     let sql = 'INSERT INTO graph_data VALUES (?)';
    //     let params = [inputText];

    //     db.executeSql(sql, params, (result) => {
    //         console.log("Success", "User created successfully.");
    //     }, (error) => {
    //         console.log("Create user error", error);
    //     });

    // }

    return (
        <View style={{ width: "100%", padding: 5 }}>
            <TextInput
                value={inputText}
                onChangeText={handleTextInputChange}
                placeholder="Enter text here"
            />
            <Button title="Submit" onPress={handleFormSubmit} />
        </View>
    );

};

