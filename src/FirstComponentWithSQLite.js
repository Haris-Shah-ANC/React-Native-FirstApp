import React, { useState, useEffect } from "react";
import { View, Text, Dimensions, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { LineChart, BarChart } from "react-native-chart-kit";
import { Table, Row } from 'react-native-table-component';
import { Picker } from '@react-native-picker/picker';
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("graphData.db");

export default function FirstComponentWithSQLite() {

    const labelsforChart = ["Jan", "Feb", "March", "April", "May", "June", "July", "August", "September", "November", "December"]

    const [userInput, setUserInput] = useState("");
    const [enteredData, setEnteredData] = useState([]);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [{ data: [] }]
    });
    const [showChart, setShowChart] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("")
    const [chartType, setChartType] = useState("Line Chart")

    let tableName = "UserMoneyData"
    if (selectedCategory !== "Money") {
        tableName = "UserWeightData"
    }

    console.log("chartData==>", chartData.datasets[0])
    console.log("enteredData==>", enteredData)

    useEffect(() => {
        createTable();
        retrieveData();
        console.log("Inside useEffect")
    }, [selectedCategory]);

    useEffect(() => {
        setChartData({
            labels: enteredData.map((entry, index) => labelsforChart[index]),
            datasets: [{ data: enteredData.map(entry => parseFloat(entry)) }]
        });
        saveData();
    }, [enteredData]);

    const createTable = () => {
        console.log("tableName==>", tableName)
        db.transaction(tx => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS ${tableName} (id INTEGER PRIMARY KEY AUTOINCREMENT, data TEXT);`
            );
        });
    };

    const saveData = () => {
        db.transaction(tx => {
            tx.executeSql(
                `INSERT INTO ${tableName} (data) VALUES (?);`,
                [JSON.stringify(enteredData)]
            );
        });
    };

    const retrieveData = () => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT * FROM ${tableName} ORDER BY id DESC LIMIT 1;`,
                [],
                (_, { rows }) => {
                    if (rows.length > 0) {
                        const lastEntry = rows.item(0).data;
                        console.log("lastEntry==>", lastEntry);
                        setEnteredData(JSON.parse(lastEntry));
                    }
                }
            );
        });
    };

    const handleInputChange = (text) => {
        if (!isNaN(text)) {
            setUserInput(text);
        }
    };

    const handleSubmit = () => {
        if (!userInput.trim()) {
            return;
        }
        setEnteredData([...enteredData, userInput]);
        setUserInput("");
    };

    const handlePlotGraph = () => {
        if (enteredData.length > 0) {
            setShowChart(true);
        }
    };

    const renderTable = () => {
        return (
            <Table>
                <Row data={chartData.labels} />
                <Row data={chartData.datasets[0].data} />
            </Table>
        );
    };

    const deleteData = () => {
        db.transaction(tx => {
            tx.executeSql(
                "DELETE FROM UserData;"
            );
        });
        setEnteredData([]);
        setShowChart(false);
    };

    return (
        // <ScrollView horizontal={true} style={viewStyles.container}>
        <View style={viewStyles.innerContainer}>

            <Picker
                placeholder="select category"
                selectedValue={selectedCategory}
                style={viewStyles.picker}
                onValueChange={(itemValue) => { setSelectedCategory(itemValue); }}
            >
                <Picker.Item label="Choose Category" value="" enabled={false} style={viewStyles.pickerPlaceholder}/>
                <Picker.Item label="Weight" value="Weight" style={viewStyles.picker} />
                <Picker.Item label="Money" value="Money" style={viewStyles.picker}/>
            </Picker>

            {chartData.datasets[0].data.length < 6 &&
                <TextInput
                    style={viewStyles.textInput}
                    value={userInput}
                    onChangeText={handleInputChange}
                    onSubmitEditing={handleSubmit}
                    keyboardType="numeric"
                    blurOnSubmit={false}
                    placeholder="Enter Numeric Data"
                />
            }
            {enteredData.length > 0 && (
                <View style={viewStyles.tableContainer}>
                    {renderTable()}
                </View>
            )}

            {enteredData.length > 0 && (
                <Button
                    style={viewStyles.buttonStyle}
                    title="Plot Graph"
                    onPress={handlePlotGraph}
                />
            )}

            {/* <Button title="Delete Data" style={viewStyles.text} onPress={deleteData} /> */}

            {showChart &&
                <View>

                    <View style={{ flexDirection: "row", margin: 7, alignItems: "center" }}>
                        <TouchableOpacity
                            style={chartType === "Line Chart" ? viewStyles.buttonStyle : viewStyles.alternateButtonStyle}
                            onPress={() => setChartType("Line Chart")}>
                            <Text style={chartType === "Line Chart" ? viewStyles.buttonText : viewStyles.alternateButtonText}>Line Chart</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={chartType === "Column Chart" ? viewStyles.buttonStyle : viewStyles.alternateButtonStyle}
                            onPress={() => setChartType("Column Chart")}>
                            <Text style={chartType === "Column Chart" ? viewStyles.buttonText : viewStyles.alternateButtonText}>Column Chart</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={viewStyles.text}>Line Chart</Text>

                    <LineChart
                        data={chartData}
                        width={Dimensions.get("window").width}
                        height={220}
                        yAxisLabel={selectedCategory === "Money" ? "$" : ""}
                        yAxisSuffix={selectedCategory === "Money" ? "k" : "kg"}
                        yAxisInterval={1}
                        chartConfig={{
                            backgroundColor: "#e26a00",
                            backgroundGradientFrom: "#1E2923",
                            backgroundGradientTo: "#08130D",
                            decimalPlaces: 2,
                            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            style: {
                                borderRadius: 16
                            },
                            propsForDots: {
                                r: "4",
                                strokeWidth: "2",
                                stroke: "#ffa726"
                            }
                        }}
                        bezier
                        style={{
                            marginVertical: 8,
                            borderRadius: 16,
                        }}
                    />
                </View>
            }
        </View>
        // </ScrollView>
    )
}


const viewStyles = StyleSheet.create({
    // container: {
    //     flex: 1,
    //     flexDirection: 'row',
    //     width: "100%",
    //     backgroundColor: '#fafafa',
    //     padding: 5,
    //     margin: 5,
    //     borderRadius: 3,
    // },
    innerContainer: {
        width: "100%",
        backgroundColor: '#fafafa',
        padding: 5,
        margin: 5,
        borderRadius: 3,
    },
    textInput: {
        borderRadius: 2,
        borderWidth: 1,
        borderColor: 'black',
        padding: 8,
        marginBottom: 10,
        margin: 7,
    },
    tableContainer: {
        marginTop: 10,
        margin: 5,
        borderWidth: 1,
        flexDirection: "column"
    },
    text: {
        fontWeight: 'bold',
        marginTop: 10,
        marginLeft: 5,
    },
    picker: {
        height: 50,
        width: "100%",
        marginBottom: 10,
        color : 'black'
    },
    pickerPlaceholder : {
        height: 50,
        width: "100%",
        marginBottom: 10,
        color : 'grey'
    },
    buttonStyle: {
        backgroundColor: "#024a73",
        margin: 0,
        padding: 3,
        width: "auto",
        borderRadius: 3,
    },
    alternateButtonStyle: {
        backgroundColor: "white",
        padding: 3,
        width: "auto",
        borderRadius: 3,
    },
    buttonText: {
        color: 'white'
    },
    alternateButtonText: {
        color: "#024a73"
    },

});