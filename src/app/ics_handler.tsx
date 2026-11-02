import { File, Paths } from 'expo-file-system';

/*
TODO:
    - AddEvent
    - RemoveEvent
    - GetEventsOnDay
*/

interface Calendar_Metadata {
    VERSION:string,
    PRODID:string,
    CALSCALE?:string,
    METHOD?:string,
    ATTACH?:string,
    CATEGORIES?:string,
    CLASS?:string,
}

interface Calendar_Event {
    UID:string,
    DTSTART: {
        TIME:Date,
        VALUE?:string,
        TIMEZONE?:string
    },
    SUMMARY?:string,           // Title
    DTEND?: {
        TIME:Date,
        VALUE?:string,
        TIMEZONE?:string
    },
    DTSTAMP?:Date,
    CLASS?:string,
    DESCRIPTION?:string
    LOCATION?:string,
    TRANSPARENCY?:string
};

interface ICS_Object {
    METADATA:Calendar_Metadata
    EVENTS:Calendar_Event[]
}

export default async function ParseIcsFile(filename:string): Promise<ICS_Object|null> {
    let events:Calendar_Event[] = [];
    let metadata_str:string = "";

    try {
        const file = new File(Paths.document, filename);

        if (!file.exists) throw new Error("File does not exists");
        
        
        // split the string per event
        const events_str:string[] = (await file.text()).replaceAll(/END:*[A_Z](\r\n|\r|\n)/g, "").split("BEGIN:");
        events_str.shift();
        metadata_str = events_str.shift()!;
        
        events_str.forEach((event:string) => {
            events.push(ParseIcsEvent(event));
        })

    } catch (error) {
        console.error(error);
        return null;
    }
    
    return {METADATA: ParseIcsHeader(metadata_str), EVENTS: events};
}

function ParseIcsHeader(header:string): Calendar_Metadata {
    const props:string[] = header.replaceAll(/(\r\n|\n|\r)\s/g, '').split(/\r\n|\n|\r/g);
    let metadata:Calendar_Metadata = { VERSION: "", PRODID: "" }
    props.forEach((prop) => {
        let key:string = prop.substring(0, prop.search(/;|:/));

        switch (key) {
            case "VERSION":
            case "PRODID":
            case "CALSCALE":
            case "METHOD":
            case "ATTACH":
            case "CATEGORIES":
            case "CLASS":
                metadata[key] = prop.slice(prop.indexOf(':') + 1);
                break;
            default:
                break;
        }
    })
    return metadata;
}

function ParseIcsEvent(event:string) {
    let ev_obj:Calendar_Event = {UID: "", DTSTART:{ TIME: new Date(0) }};
    
    // Remove line folding
    event.replaceAll(/(\r\n|\n|\r)\s/g, '');

    const properties = event.split(/\r\n|\n|\r/g);
    properties.forEach((prop) => {
        let key:string = prop.substring(0, prop.search(/;|:/));

        // TODO:    - calculate DTEND using DURATION if it exists
        //          - RRULE
        //          - Alarms
        //          - Attendees
        switch (key) {
            case "DTSTART":
            case "DTEND":
                const timestmp:string = prop.substring(prop.indexOf(':'));
                const tz:string|undefined = GetProperty(prop, "TZID");
                const value:string|undefined = GetProperty(prop, "VALUE");

                ev_obj[key] = {TIME: GetDate(timestmp, tz)};
                if (value) ev_obj[key]["VALUE"] = value;
                break;
            
            case "DTSTAMP":
                ev_obj[key] = GetDate(prop.slice(prop.indexOf(':')));
                break;

            case "UID":
            case "SUMMARY":
            case "DESCRIPTION":
            case "LOCATION":
                ev_obj[key] = prop.slice(prop.indexOf(':') + 1);
            default:
                break;
        }
    })
    return ev_obj;
}

// Currently a crutch against not parsing VTIMEZONE, but we deal with that later
function GetDate(value:string, tz:string = "GMT") {
    const tz_text = new Date().toLocaleString("en", {timeZone: tz, timeStyle: "long"}).split(" ").slice(-1)[0];

    const tDenom = value.indexOf('T')
    let date = value.slice(0,5).concat('-', value.slice(5,7), '-', value.slice(7,9));

    if (tDenom > 0) {
        date = date.concat(' ', value.slice(tDenom + 1, tDenom + 3), ':', value.slice(tDenom + 3, tDenom + 5), ':', value.slice(tDenom + 5, tDenom + 7))
    }

    return new Date(`${date} ${tz_text}`);
}

function GetProperty(propLine:string, prop:string):string|undefined {
    return propLine.includes(prop)?
        propLine.substring(propLine.indexOf(prop) + prop.length, propLine.indexOf(';', propLine.indexOf(prop))):
        undefined
}
