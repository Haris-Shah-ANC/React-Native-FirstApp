
export default function FirstComponent() {

    const handleDeleteData = () => {
        _deleteData();
        setEnteredData([]);
        setShowChart(false);
    };

    return (
        <ScrollView horizontal={true} style={viewStyles.container}>
            <View style={viewStyles.innerContainer}>
                {enteredData.length > 0 && (
                    <Button
                        title="Delete Data"
                        onPress={handleDeleteData}
                        style={viewStyles.buttonStyle}
                    />
                )}
            </View>
        </ScrollView>
    );
}

/////////////////////////////////////////////////////////////////////////////////////////

export default function FirstComponent() {


    return (
        <ScrollView horizontal={true} style={viewStyles.container}>
            <View style={viewStyles.innerContainer}>
            </View>
        </ScrollView>
    );
}

const viewStyles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    innerContainer: {
        width: "100%",
        backgroundColor: '#fafafa',
        padding: 5,
        margin: 5,
        borderRadius: 3,
    },
});