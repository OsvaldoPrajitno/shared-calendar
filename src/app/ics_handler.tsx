import { File, Paths } from 'expo-file-system';

/*
TODO:
    - AddEvent
    - RemoveEvent
    - GetEventsOnDay
*/


interface ICS_Object {
    UID: string,
    DTSTART: { VALUE: Date},
    SUMMARY?: string,           // Title
    DTEND?: { VALUE: Date},
    CLASS?: string,
    DESCRIPTION?: string
    LOCATION?: string
};

export default async function ParseIcsFile(filename:string) {
    try {
        const file = new File(Paths.document, filename);
        let events = [];
        
        // split the string per event and remove the header of the ICS file (BEGIN:VCALENDAR, PRODID, VERSION, etc)
        const events_string: string[] = (await file.text()).replaceAll("END:VEVENT", "").split("BEGIN:VEVENT");
        events_string.shift();
        
        events_string.forEach((event:string) => {
            events.push(ParseIcsEvent(event));
        })
    } catch (error) {
        console.error(error);
    }
}

function ParseIcsEvent(event:string) {
    // ICS format
    let ev_obj: ICS_Object = {UID: "", DTSTART: {VALUE: new Date(0)}};
    
    // Remove line folding
    event.replaceAll(/(\n|\r)\s/g, '');

    const properties = event.split(/\n|\r/g);
    properties.forEach((prop) => {
        let key:string = prop.substring(0, prop.search(/;|:/));

        // TODO:    - calculate DTEND using DURATION if it exists
        //          - LOCATION
        //          - RRULE
        //          - Alarms
        //          - Attendees
        switch (key) {
            case "DTSTART":
            case "DTEND":
                const value:string = prop.substring(prop.indexOf(':'));
                const tz:string | undefined = prop.includes("TZID") ? prop.substring(prop.indexOf('=') + 1, prop.indexOf(':')) : undefined;
                ev_obj[key] = {VALUE: GetDate(value, tz)};
                break;
            
            case "UID":
            case "SUMMARY":
            case "DESCRIPTION":
            case "LOCATION":
                ev_obj[key] = prop.slice(prop.indexOf(':'));
            default:
                break;
        }
    })
    return ev_obj;
}

function GetDate(value: string, tz: string = "GMT") {
    const tz_text = new Date().toLocaleString("en", {timeZone: tz, timeStyle: "long"}).split(" ").slice(-1)[0];

    const tDenom = value.indexOf('T')
    let date = value.slice(0,4).concat('-', value.slice(4,6), '-', value.slice(6,8));

    if (tDenom > 0) {
        date = date.concat(value.slice(tDenom + 1, tDenom + 3), ':', value.slice(tDenom + 3, tDenom + 5), ':', value.slice(tDenom + 5))
    }

    return new Date(`${date} ${tz_text}`);
}
