
/* =====================================
   ZERO TRACE - CASE DATABASE
===================================== */

const CASES = [

    {
        id: "case001",
        number: "001",
        title: "The Missing Identity",
        difficulty: "BEGINNER",
        reward: 250,

        description:
            "A fictional university investigation report contains incomplete identity information. Your task is to examine the records and identify the correct investigator profile.",

        briefing: [
            "Three fictional records were recovered.",
            "Each record contains a different investigator ID.",
            "The correct identity must match all the available clues."
        ],

        evidence: [
            {
                id: "ev001",
                title: "Identity Record",
                content:
                    "Record A: Agent 104. Department: Digital Forensics."
            },
            {
                id: "ev002",
                title: "Department Report",
                content:
                    "The missing investigator belongs to Digital Forensics."
            },
            {
                id: "ev003",
                title: "Verification Note",
                content:
                    "The correct record number is 104."
            }
        ],

        question: {
            text: "Which agent number belongs to the Digital Forensics investigator?",
            answer: "104",
            hint: "Check the Identity Record and Verification Note.",
            explanation:
                "Agent 104 matches the department and verification information."
        }
    },

    {
        id: "case002",
        number: "002",
        title: "The Silent Server",
        difficulty: "BEGINNER",
        reward: 350,

        description:
            "A simulated university server stopped responding. Examine the fictional maintenance records to identify the reported cause.",

        briefing: [
            "The server became unavailable at 10:30 AM.",
            "A maintenance record was recovered.",
            "Find the event that explains the outage."
        ],

        evidence: [
            {
                id: "ev004",
                title: "Server Timeline",
                content:
                    "10:00 AM - Server online. 10:30 AM - Server unavailable."
            },
            {
                id: "ev005",
                title: "Maintenance Record",
                content:
                    "10:25 AM - Scheduled power maintenance started."
            },
            {
                id: "ev006",
                title: "Technician Note",
                content:
                    "The outage was associated with scheduled power maintenance."
            }
        ],

        question: {
            text: "What event was associated with the server outage?",
            answer: "power maintenance",
            hint: "Look at the Maintenance Record.",
            explanation:
                "The technician confirmed that scheduled power maintenance was associated with the outage."
        }
    },

    {
        id: "case003",
        number: "003",
        title: "The Encrypted Message",
        difficulty: "INTERMEDIATE",
        reward: 500,

        description:
            "An educational puzzle contains a message encoded using a simple Caesar shift. Recover the original word.",

        briefing: [
            "The message uses a Caesar shift of one position forward.",
            "Each original letter was replaced by the next alphabet letter.",
            "Move each encoded letter one position backward."
        ],

        evidence: [
            {
                id: "ev007",
                title: "Encoded Message",
                content: "IFMMP"
            },
            {
                id: "ev008",
                title: "Encoding Note",
                content:
                    "Each letter has been shifted forward by one alphabet position."
            },
            {
                id: "ev009",
                title: "Alphabet Reference",
                content:
                    "A = 1, B = 2, C = 3 ... Z = 26."
            }
        ],

        question: {
            text: "What is the original five-letter message?",
            answer: "hello",
            hint: "Move every letter one position backward. I becomes H.",
            explanation:
                "IFMMP becomes HELLO when each letter is moved backward by one position."
        }
    },

    {
        id: "case004",
        number: "004",
        title: "The Digital Footprint",
        difficulty: "INTERMEDIATE",
        reward: 600,

        description:
            "A fictional activity report contains three timestamps. Determine which record was created first.",

        briefing: [
            "Three records have been recovered.",
            "All timestamps use the same date.",
            "Identify the earliest recorded event."
        ],

        evidence: [
            {
                id: "ev010",
                title: "Record A",
                content: "Created at 14:30."
            },
            {
                id: "ev011",
                title: "Record B",
                content: "Created at 09:15."
            },
            {
                id: "ev012",
                title: "Record C",
                content: "Created at 12:45."
            }
        ],

        question: {
            text: "Which record was created first? Enter A, B or C.",
            answer: "b",
            hint: "Compare the three times using a 24-hour clock.",
            explanation:
                "Record B was created at 09:15, earlier than the other records."
        }
    },

    {
        id: "case005",
        number: "005",
        title: "The Corrupted File",
        difficulty: "ADVANCED",
        reward: 750,

        description:
            "A fictional digital archive contains two file-integrity reports. Determine which file matches its original checksum.",

        briefing: [
            "An original reference checksum is available.",
            "Two file reports were recovered.",
            "A matching checksum indicates the same recorded value."
        ],

        evidence: [
            {
                id: "ev013",
                title: "Original Reference",
                content: "Checksum: ABC123"
            },
            {
                id: "ev014",
                title: "File A Report",
                content: "Checksum: XYZ789"
            },
            {
                id: "ev015",
                title: "File B Report",
                content: "Checksum: ABC123"
            }
        ],

        question: {
            text: "Which file matches the original reference? Enter A or B.",
            answer: "b",
            hint: "Compare each file's checksum with ABC123.",
            explanation:
                "File B has the same checksum value as the original reference."
        }
    },

    {
        id: "case006",
        number: "006",
        title: "Operation Zero Trace",
        difficulty: "EXPERT",
        reward: 1000,

        description:
            "The final investigation combines identity verification, timestamps and file integrity. Review all three clues to identify the correct archive.",

        briefing: [
            "The investigator ID must be 204.",
            "The archive must have been created at 11:00.",
            "Its checksum must match the reference value ZX900."
        ],

        evidence: [
            {
                id: "ev016",
                title: "Investigator Record",
                content: "Agent 204 is assigned to the final investigation."
            },
            {
                id: "ev017",
                title: "Archive Timeline",
                content: "Archive B was created at 11:00."
            },
            {
                id: "ev018",
                title: "Integrity Report",
                content: "Archive B checksum: ZX900. Reference: ZX900."
            }
        ],

        question: {
            text: "Which archive satisfies all three investigation clues? Enter B.",
            answer: "b",
            hint: "Check the investigator ID, creation time and checksum.",
            explanation:
                "Archive B matches the required timestamp and checksum, and the investigator record confirms Agent 204."
        }
    }

];
