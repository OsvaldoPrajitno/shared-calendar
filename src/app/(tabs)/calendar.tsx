import { useState } from 'react';
import { StyleSheet } from "react-native";
import { Calendar } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';

/*
TODO:
    - Add multi-period marking
    - Add elongated calendar with event text per tile
    - Add swipable dates 
*/
export default function RenderCalendar() {
    const [selected, setSelected] = useState('');

    return (
        <SafeAreaView style={{backgroundColor: '#212121'}}>
            <Calendar
                theme={{
                    calendarBackground: '#212121',
                    textSectionTitleColor: '#ffffff',
                    selectedDayBackgroundColor: '#00adf5',
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: '#f5c31d',
                    dayTextColor: '#ffffff',
                    textDisabledColor: '#494949',
                    monthTextColor: "#ffffff"
                }}
                onDayPress={day => {
                    setSelected(day.dateString);
                }}
                markedDates={{
                    [selected]: {selected: true, disableTouchEvent: true, selectedColor: 'green'}
                }}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    customHeaderStyle: {
        
    }
})