const stadiumByCity: Record<string, string> = {
  CASA: "stadium-casa",
  MARR: "stadium-marrakech",
};

const cityCodeByStadium: Record<string, string> = {
  "stadium-casa": "CASA",
  "stadium-marrakech": "MARR",
};

const fanNamePool = [
  "Yassine",
  "Imane",
  "Karim",
  "Salma",
  "Hamza",
  "Nour",
  "Reda",
  "Lina",
  "Anas",
  "Aya",
];

export type ParsedTicket = {
  stadiumId: string;
  section: string;
  row: string;
  seat: string;
  fanName: string;
};

export function parseTicketQr(qr: string): ParsedTicket | null {
  if (!qr) return null;
  const trimmed = qr.trim().toUpperCase();

  // Demo shortcut: DEMO-CASA-A-12-15
  // Standard:     STADIUM-CASA-A-12-15  or  TICKET-MARR-B-3-7
  const parts = trimmed.split("-");
  if (parts.length < 5) return null;

  // Last four parts after the prefix(es) are city, section, row, seat.
  const cityCode = parts[parts.length - 4];
  const section = parts[parts.length - 3];
  const row = parts[parts.length - 2];
  const seat = parts[parts.length - 1];

  const stadiumId = stadiumByCity[cityCode];
  if (!stadiumId) return null;
  if (!section || !row || !seat) return null;

  const seedNum = (section.charCodeAt(0) + Number(row) + Number(seat)) % fanNamePool.length;
  const fanName = fanNamePool[seedNum] ?? "Fan";

  return {
    stadiumId,
    section,
    row,
    seat,
    fanName,
  };
}

export function cityCodeFor(stadiumId: string): string | undefined {
  return cityCodeByStadium[stadiumId];
}
