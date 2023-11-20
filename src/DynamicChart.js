import { TextInput, View, StyleSheet, Text, Dimensions, Button } from "react-native";
import { useEffect, useState } from "react";
import * as SQLite from "expo-sqlite";
import { LineChart } from "react-native-chart-kit";

const db = SQLite.openDatabase("dynamicGraph.db");

export default function DynamicChart() {

    const [inputLabel, setInputLabel] = useState("")
    const [inputData, setInputData] = useState("")
    const [graphData, setGraphData] = useState([]);
    const [graphLabels, setGraphLabels] = useState([]);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [{ data: [] }]
    })
    const [showChart, setShowChart] = useState(false);

    console.log("chartData.datasets==>", chartData.datasets[0])
    console.log("chartData.labels==>", chartData.labels)
    // console.log("graphData==>",graphData)
    // console.log("graphLabels==>",graphLabels)

    useEffect(() => {
        createTable();
        retrieveData();
    }, []);

    useEffect(() => {
        setChartData({
            labels: graphLabels.map((label, index) => label),
            datasets: [{ data: graphData.map((entry) => parseFloat(entry)) }]
        });
        saveData();
    }, [graphLabels, graphData]);

    const createTable = () => {
        db.transaction(tx => {
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS userInfo (id INTEGER PRIMARY KEY AUTOINCREMENT,label TEXT,data TEXT );"
            );
        });
    };

    const saveData = () => {
        db.transaction(tx => {
            tx.executeSql(
                "INSERT INTO userInfo (label,data) VALUES (?);",
                [JSON.stringify(graphLabels), JSON.stringify(graphData)]
            )
        })
    }

    const retrieveData = () => {
        db.transaction(tx => {
            tx.executeSql(
                "SELECT id,label FROM userInfo ORDER BY id DESC LIMIT 1;",
                [],
                console.log("inside retrieveData"),
                (_, rows) => {
                    if (rows.length > 0) {
                        console.log("rows", rows)
                        const lastEntry = rows.item(0).data;
                        setGraphLabels(JSON.parse(lastEntry));
                    }
                }
            );
        })
    }

    const handleInputLabelChange = (text) => {
        setInputLabel(text);
    }

    const handleInputDataChange = (text) => {
        setInputData(text);
    }

    const handleLabelSubmit = () => {
        if (!inputLabel.trim()) {
            return;
        }
        setGraphLabels([...graphLabels, inputLabel])
        setInputLabel("");
    }

    const handleDataSubmit = () => {
        if (!inputData.trim()) {
            return;
        }
        setGraphData([...graphData, inputData])
        setInputData("");
    }

    return (
        <View style={graphStyles.container}>

            <TextInput
                style={graphStyles.textInput}
                value={inputLabel}
                onChangeText={handleInputLabelChange}
                onSubmitEditing={handleLabelSubmit}
                placeholder="enter time"
            />

            <TextInput
                value={inputData}
                style={graphStyles.textInput}
                onChangeText={handleInputDataChange}
                onSubmitEditing={handleDataSubmit}
                keyboardType="numeric"
                placeholder="enter data"
            />
            <Button title="retrieve Data" onPress={retrieveData} />
            {showChart &&
                <View>
                    <Text style={graphStyles.text}>Line Chart</Text>
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
    )
}

const graphStyles = StyleSheet.create({
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
})