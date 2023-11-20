import React, { useState, useEffect } from "react";
import { View, Text, Dimensions, TextInput, Button, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Table, Row } from 'react-native-table-component';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({ name: "myDatabase.db", location: "default" });

export default function FirstComponentWithSQLite() {

    const labelsforChart = ["Jan", "Feb", "March", "April", "May", "June", "July", "August", "September", "November", "December"]

    const [userInput, setUserInput] = useState("");
    const [enteredData, setEnteredData] = useState([]);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [{ data: [] }]
    });
    const [showChart, setShowChart] = useState(false);

    console.log("chartData==>", chartData.datasets[0])
    console.log("enteredData==>", enteredData)

    useEffect(() => {
        createTable();
        retrieveData();
    }, []);

    useEffect(() => {
        setChartData({
            labels: enteredData.map((entry, index) => labelsforChart[index]),
            datasets: [{ data: enteredData.map(entry => parseFloat(entry)) }]
        });
        saveData();
    }, [enteredData]);

    const createTable = () => {
        db.transaction(tx => {
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS UserData (id INTEGER PRIMARY KEY AUTOINCREMENT, data TEXT);"
            );
        });
    };

    const saveData = () => {
        db.transaction(tx => {
            tx.executeSql(
                "INSERT INTO UserData (data) VALUES (?);",
                [JSON.stringify(enteredData)]
            );
        });
    };

    const retrieveData = () => {
        db.transaction(tx => {
            tx.executeSql(
                "SELECT * FROM UserData ORDER BY id DESC LIMIT 1;",
                [],
                (_, { rows }) => {
                    if (rows.length > 0) {
                        const lastEntry = rows.item(0).data;
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

    return (
        <View style={viewStyles.innerContainer}>
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
                    title="Plot Graph"
                    onPress={handlePlotGraph}
                />
            )}
            {showChart &&
                <View>
                    <Text style={viewStyles.text}>Line Chart</Text>
                    <LineChart
                        data={chartData}
                        width={Dimensions.get("window").width}
                        height={220}
                        yAxisLabel="$"
                        yAxisSuffix="k"
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
    );
}

const viewStyles = StyleSheet.create({
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
});

////////////////////////////////////////////////////////////////////////////////////////////

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

    console.log("chartData==>", chartData.datasets[0])
    console.log("enteredData==>", enteredData)

    useEffect(() => {
        createTable();
        retrieveData();
    }, []);

    useEffect(() => {
        setChartData({
            labels: enteredData.map((entry, index) => labelsforChart[index]),
            datasets: [{ data: enteredData.map(entry => parseFloat(entry)) }]
        });
        saveData();
    }, [enteredData]);

    const createTable = () => {
        db.transaction(tx => {
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS UserData (id INTEGER PRIMARY KEY AUTOINCREMENT, data TEXT);"
            );
        });
    };

    const saveData = () => {
        db.transaction(tx => {
            tx.executeSql(
                "INSERT INTO UserData (data) VALUES (?);",
                [JSON.stringify(enteredData)]
            );
        });
    };

    const retrieveData = () => {
        db.transaction(tx => {
            tx.executeSql(
                "SELECT * FROM UserData ORDER BY id DESC LIMIT 1;",
                [],
                (_, { rows }) => {
                    if (rows.length > 0) {
                        const lastEntry = rows.item(0).data;
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
            tx.executeSql (
                "DELETE FROM UserData;"
            );
        });
        setEnteredData([]);
        setShowChart(false);
    };

    return (
        // <ScrollView horizontal={true} style={viewStyles.container}>
        <View style={viewStyles.innerContainer}>
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
                    title="Plot Graph"
                    onPress={handlePlotGraph}
                />
            )}

            {/* <Button title="Delete Data" style={viewStyles.text} onPress={deleteData}/> */}

            {showChart &&
                <View>
                    <Text style={viewStyles.text}>Line Chart</Text>
                    <LineChart
                        data={chartData}
                        width={Dimensions.get("window").width}
                        height={220}
                        yAxisLabel="$"
                        yAxisSuffix="k"
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
});