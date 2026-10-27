import { StyleSheet, Text, View } from "react-native";

export default function AboutScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>About this Calendar</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#212121",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
    },

    text: {
        color: "white",
    }
})