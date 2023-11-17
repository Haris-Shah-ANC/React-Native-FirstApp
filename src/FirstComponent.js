import React, { useState, useEffect, useRef } from "react";
import { View, Text, Dimensions, TextInput, Button, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";
// import AsyncStorage from "@react-native-async-storage/async-storage";
import { Table, Row } from 'react-native-table-component';
// import SQLite from 'react-native-sqlite-2';
import * as SecureStore from 'expo-secure-store';

export default function FirstComponent() {

    const labelsforChart = ["Jan", "Feb", "March", "April", "May", "June", "July", "August", "September", "November", "December"]

    const [userInput, setUserInput] = useState("");
    const [enteredData, setEnteredData] = useState([]);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [{ data: [] }]
    });
    const [showChart, setShowChart] = useState(false);
    const [isdeleted,setIsdeleted] = useState(false);

    console.log("chartData==>", chartData.datasets[0])
    console.log("enteredData==>", enteredData)

    useEffect(() => {
        _retrieveData();
    }, []);

    useEffect(() => {
        setChartData({
            labels: enteredData.map((entry, index) => labelsforChart[index]),
            datasets: [{ data: enteredData.map(entry => parseFloat(entry)) }]
        });
        // Save enteredData to SecureStore whenever it changes
        _storeData();
    }, [enteredData]);

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

    const _storeData = async () => {
        try {
            await SecureStore.setItemAsync("enteredData", JSON.stringify(enteredData));
        } catch (error) {
            console.log("Error Saving Data", error);
        }
    };

    const _retrieveData = async () => {
        try {
            const value = await SecureStore.getItemAsync("enteredData");
            console.log("value==>", value)
            if (value !== null) {
                setEnteredData(JSON.parse(value));
            }
        } catch (error) {
            console.log("Error retrieving data", error);
        }
    };

    const _deleteData = async () => {
        try {
            await SecureStore.deleteItemAsync("enteredData");
            console.log("Data deleted successfully")
            _retrieveData()
        } catch (error) {
            console.log("Error deleting data", error)
        }
    }

    return (
        <View style={viewStyles.container} >
            {chartData.datasets[0].data.length < 6  &&
                <TextInput
                    // className="border-2"
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
                <Button title="Plot Graph"
                    onPress={handlePlotGraph}
                // onPress={() => { handlePlotGraph(); setShowChart(true) }}
                />
            )}
            {/* <Button style={viewStyles.buttonStyle} title="get Data" onPress={_retrieveData} /> */}
            {/* <Button style={viewStyles.buttonStyle} title="delete data" onPress={() => {_deleteData() ; setIsdeleted(true)}} /> */}
            {/* <Button title="Delete Data" onPress={() => {_deleteData}}/> */}

            {showChart &&

                <View>
                    <Text style={viewStyles.text}>Line Chart</Text>
                    <LineChart
                        data={chartData}
                        // data={{
                        //     labels: ["January", "February", "March", "April", "May", "June"],
                        //     datasets: [
                        //         {
                        //             data: [
                        //                 Math.random() * 100,
                        //                 Math.random() * 100,
                        //                 Math.random() * 100,
                        //                 Math.random() * 100,
                        //                 Math.random() * 100,
                        //                 Math.random() * 100
                        //             ]
                        //         }
                        //     ]
                        // }}
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

// const handlePlotGraph = () => {
//     if (enteredData.length > 0) {

//         setChartData({
//             labels: enteredData.map((entry, index) => labelsforChart[index]),
//             datasets: [{ data: enteredData.map(entry => parseFloat(entry)) }]
//         });
//     }
// };

const viewStyles = StyleSheet.create({
    container: {
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

    },
    text: {
        fontWeight: 'bold',
        marginTop: 10,
        marginLeft: 5
    },
    buttonStyle: {
        margin: 5,
    }
});
