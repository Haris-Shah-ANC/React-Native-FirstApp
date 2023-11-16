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

    console.log('chartData==>',chartData)
    useEffect(() => {
        setChartData({
            labels: enteredData.map((entry, index) => labelsforChart[index]),
            datasets: [{ data: enteredData.map(entry => parseFloat(entry)) }]
        });

    }, [enteredData]);

    // useEffect(() => {
    //     _retrieveData()
    // }, []);

    const handleInputChange = (text) => {
        if (!isNaN(text)) {
            setUserInput(text);
        }
    };

    const handleSubmit = () => {

        if (!userInput.trim()) {
            return;
        }
        // Update enteredData and clear userInput
        setEnteredData([...enteredData, userInput]);
        // _storeData(); 
        // _retrieveData()
        setUserInput("");

        // Saving enteredData to AsyncStorage
        // AsyncStorage.setItem("enteredData", JSON.stringify([...enteredData, userInput])); 
        _storeData();
    };

    const handlePlotGraph = () => {

        // if (enteredData.length > 0) {

        //     setChartData({
        //         labels: enteredData.map((entry, index) => `Entry ${index + 1}`),
        //         datasets: [{ data: enteredData.map(entry => parseFloat(entry)) }]
        //     });
        // }
    };

    const renderTable = () => {
        return (
            <Table style={viewStyles.tableContainer}>
                <Row data={chartData.labels} />
                <Row data={chartData.datasets[0].data} />
            </Table>
        );
    };

    const _storeData = async () => {
        try {
            await SecureStore.setItemAsync("enteredData", JSON.stringify([...enteredData, userInput]))
        } catch (error) {
            console.log("Error Saving Data", error)
        }
    }

    const _retrieveData = async () => {
        try {
            const value = await SecureStore.getItemAsync("enteredData");
            if (value !== null) {
                // setEnteredData([...enteredData, value])
                console.log(value)
                // return value;
            }
        } catch (error) {
            console.log("Error retrieving data", error)
        }
    }

    return (
        <View style={viewStyles.container} >
            <TextInput
                // className="border-2"
                style={viewStyles.textInput}
                value={userInput}
                onChangeText={handleInputChange}
                onSubmitEditing={handleSubmit}
                keyboardType="numeric"
                blurOnSubmit={false}
            />
            {enteredData.length > 0 && (
                <View style={viewStyles.tableContainer}>
                    {renderTable()}
                </View>
            )}
            {/* {enteredData.length > 0 && (
                <Button title="Plot Graph"
                    // onPress={handlePlotGraph} 
                    onPress={() => { handlePlotGraph(); setShowChart(true) }}
                />
            )} */}
            <Button title="get Data" onPress={_retrieveData} />
            {/* <Button title="Delete Data" onPress={() => {SecureStore.deleteItemAsync("enteredData")}}/> */}

            {/* {showChart && */}

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
            {/* } */}
        </View>
    );
}

const viewStyles = StyleSheet.create({
    container: {
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
        marginLeft: 3,
    },
    text: {
        fontWeight: 'bold',
        marginTop: 10,
        marginLeft: 5
    }
});
