import { UserData } from "@/types/data-grid.types";

export function generateMockData(): UserData[] {
  const firstNames = [
    "Ali", "Mohammad", "Amir", "Reza", "Hossein", "Mehdi", "Sara",
    "Maryam", "Fatemeh", "Zahra", "Narges", "Elnaz", "Shima", "Negin",
    "Arash", "Kian", "Shayan", "Parham", "Baran", "Dorsa", "Nazanin",
    "Ghazal", "Saman", "Behnam",
  ];

  const lastNames = [
    "Mohammadi", "Hosseini", "Ahmadi", "Rezaei", "Mousavi", "Jafari",
    "Karimi", "Norouzi", "Ghasemi", "Abbasi", "Moradi", "Sadeghi",
    "Soltani", "Yazdani", "Tehrani", "Shirazi", "Esfahani", "Tabrizi",
  ];

  const cities = ["Tehran", "Shiraz", "Isfahan", "Tabriz", "Mashhad", "Karaj"];

  const domains = ["gmail.com", "yahoo.com", "outlook.com", "proton.me"];

  const statuses: Array<"active" | "inactive" | "pending"> = [
    "active", "inactive", "pending",
  ];

  function randomFrom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function generateShamsiDate(index: number): string {
    const year = 1400 + (index % 4);
    const month = (index % 12) + 1;
    const day = (index % 28) + 1;
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  const data: UserData[] = [];

  for (let i = 1; i <= 100; i++) {
    const firstName = randomFrom(firstNames);
    const lastName = randomFrom(lastNames);
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@${randomFrom(domains)}`;

    data.push({
      id: i,
      name: `${firstName} ${lastName}`,
      email,
      age: 20 + (i % 40),
      city: randomFrom(cities),
      status: randomFrom(statuses),
      isVerified: i % 3 !== 0,
      createdAt: generateShamsiDate(i),
    });
  }

  return data;
}

export const mockUsers: UserData[] = generateMockData();