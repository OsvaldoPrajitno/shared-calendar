import ParseIcsFile from "@/app/ics_handler";

const mockText = jest.fn();
let mockExists = true;

jest.mock('expo-file-system', () => ({
  Paths: { document: '/mock/documents' },
  File: jest.fn().mockImplementation((...parts: string[]) => ({
    get exists() { return mockExists; },
    text: mockText,
  })),
}));

beforeEach(() => {
  mockExists = true;
  mockText.mockReset();
});

test('Parsing a basic ics file', async () => {
    mockText.mockResolvedValue(`BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Example//Calendar//EN\nBEGIN:VEVENT\nUID:event1@example.com\nDTSTAMP:20260122T120000Z\nDTSTART:20260125T140000Z\nSUMMARY:Event 1\nEND:VEVENT\nBEGIN:VEVENT\nUID:event2@example.com\nDTSTAMP:20260122T120000Z\nDTSTART:20260126T100000Z\nSUMMARY:Event 2\nEND:VEVENT\nBEGIN:VEVENT\nUID:event3@example.com\nDTSTAMP:20260122T120000Z\nDTSTART:20260127T150000Z\nSUMMARY:Event 3\nEND:VEVENT\nEND:VCALENDAR`);
    await expect(ParseIcsFile("basic.ics")).resolves.toEqual({
        METADATA: {
            VERSION:"2.0",
            PRODID: "-//Example//Calendar//EN",
        },
        EVENTS: [
            {
                UID: "event1@example.com",
                DTSTAMP: new Date(1769083200000),
                DTSTART: {TIME: new Date(1769349600000)},
                SUMMARY: "Event 1"
            },
            {
                UID: "event2@example.com",
                DTSTAMP: new Date(1769083200000),
                DTSTART: {TIME: new Date(1769421600000)},
                SUMMARY: "Event 2"
            },
            {
                UID: "event3@example.com",
                DTSTAMP: new Date(1769083200000),
                DTSTART: {TIME: new Date(1769526000000)},
                SUMMARY: "Event 3"
            }
        ]
    })
});