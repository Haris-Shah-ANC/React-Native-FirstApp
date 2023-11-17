import React, { useState, useEffect } from "react";
import { View, Text, Dimensions, TextInput, Button, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";
import * as SecureStore from 'expo-secure-store';
import { Table, Row } from 'react-native-table-component';

export default function FirstComponent() {
    const labelsforChart = ["Jan", "Feb", "March", "April", "May", "June", "July", "August", "September", "November", "December"];

    const [userInput, setUserInput] = useState("");
    const [enteredData, setEnteredData] = useState([]);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [{ data: [] }]
    });
    const [showChart, setShowChart] = useState(false);

    useEffect(() => {
        _retrieveData();
    }, []);

    useEffect(() => {
        // Update chartData whenever enteredData changes
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
        // Update enteredData and clear userInput
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
            if (value !== null) {
                setEnteredData(JSON.parse(value));
            }
        } catch (error) {
            console.log("Error retrieving data", error);
        }
    };

    return (
        <View style={viewStyles.container}>
            <TextInput
                style={viewStyles.textInput}
                value={userInput}
                onChangeText={handleInputChange}
                onSubmitEditing={handleSubmit}
                keyboardType="numeric"
                blurOnSubmit={false}
                placeholder="Enter Numeric Data"
            />
            {enteredData.length > 0 && (
                <View style={viewStyles.tableContainer}>
                    {renderTable()}
                </View>
            )}
            {enteredData.length > 0 && (
                <Button title="Plot Graph" onPress={handlePlotGraph} />
            )}
            <Button style={viewStyles.button} title="get Data" onPress={_retrieveData} />

            {showChart && (
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
            )}
        </View>
    );
}

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
    button: {
        margin: 5,
    }
});
