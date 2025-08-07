import type { Column } from "@/types";
export default function useAddResidentialInspection(){
    
    const ExteriorColumns: Column[] = [
        {
            captionLabel: "Are things loose, cracked, damaged, rotted, bug infested",
            headerName: "Exterior",
            note : "",
            rows: [
                {
                    rowName: "Back Doors",
                    status: {
                        good: false,
                        ok: false,
                        bad: false
                    }
                },
                {
                    rowName: "Deck, veranda, patio",
                    status: {
                        good: false,
                        ok: false,
                        bad: false
                    }
                },
                {
                    rowName: "Doorbell",
                    status: {
                        good: false,
                        ok: false,
                        bad: false
                    }
                },
                {
                    rowName: "Driveway",
                    status: {
                        good: false,
                        ok: false,
                        bad: false
                    }
                },
                {
                    rowName: "Front Doors",
                    status: {
                        good: false,
                        ok: false,
                        bad: false
                    }
                },
                {
                    rowName: "Garage Doors",
                    status: {
                        good: false,
                        ok: false,
                        bad: false
                    }
                },
                {
                    rowName: "Garbage receptable",
                    status: {
                        good: false,
                        ok: false,
                        bad: false
                    }
                },
                {
                    rowName: "House Number",
                    status: {
                        good: false,
                        ok: false,
                        bad: false
                    }
                },
                {
                    rowName: "Mailbox",
                    status: {
                        good: false,
                        ok: false,
                        bad: false
                    }
                },
                 {
                    rowName: "Outdoor lights",
                    status: {
                        good: false,
                        ok: false,
                        bad: false
                    }
                },
                 {
                    rowName: "Paint and trim",
                    status: {
                        good: false,
                        ok: false,
                        bad: false
                    }
                },
                 {
                    rowName: "Parking",
                    status: {
                        good: false,
                        ok: false,
                        bad: false
                    }
                },
                {
                    rowName: "Recycling receptable",
                    status: {
                        good: false,
                        ok: false,
                        bad: false
                    }
                },
                {
                    rowName: "Sidewalks",
                    status: {
                        good: false,
                        ok: false,
                        bad: false
                    }
                },
                {
                    rowName: "Siding (brick/stone/cement)",
                    status: {
                        good: false,
                        ok: false,
                        bad: false
                    }
                },
                {
                    rowName: "Traffic Noise",
                    status: {
                        good: false,
                        ok: false,
                        bad: false
                    }
                },
                   {
                    rowName: "Windows",
                    status: {
                        good: false,
                        ok: false,
                        bad: false
                    }
                },

            ]
        }
    ];

    return {
        ExteriorColumns
    }
}