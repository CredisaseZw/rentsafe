export const sampleCompanyReport = {
   claims: [
      { claimant: "John Doe", type: "Rent", currency: "USD", amount: 500, dateOfClaim: "2023-01-10" },
      { claimant: "Jane Smith", type: "Deposit", currency: "USD", amount: 300, dateOfClaim: "2023-02-20" },
   ],
   active: [
      { creditor: "Landlord A", type: "Residential", outstandingSince: "2023-03-01", amount: 200 },
      { creditor: "Landlord B", type: "Commercial", outstandingSince: "2023-04-15", amount: 1000 },
   ],
   historic: [
      { creditor: "Landlord C", type: "Residential", outstandingSince: "2022-05-10", amount: 150 },
      { creditor: "Landlord D", type: "Commercial", outstandingSince: "2021-08-20", amount: 800 },
   ],
   rating: "Non payer",
   companyDetails: {
      registeredName: "Tech Solutions Ltd",
      tradingName: "Tech Solutions",
      registrationNumber: "123456789",
      dateOfRegistration: "2020-01-01",
      tradingStatus: "Active",
      industrySector: "Information Technology",
      telephoneNumber: "071 123 4567",
      mobileNumber: "071 123 4567",
      email: "info@techsolutions.com",
      website: "www.techsolutions.com",
      address: "123 Main St, Harare, Zimbabwe",
   },
};

export const sampleCompanyRows = [
   {
      id: 1,
      registeredName: "Tech Solutions Ltd",
      registrationNumber: "123456789",
   },
   {
      id: 2,
      registeredName: "Innovatech Corp",
      registrationNumber: "987654321",
   },
   {
      id: 3,
      registeredName: "Global Enterprises",
      registrationNumber: "456789123",
   },
   {
      id: 4,
      registeredName: "Future Tech Inc",
      registrationNumber: "321654987",
   },
   {
      id: 5,
      registeredName: "Smart Innovations",
      registrationNumber: "789123456",
   },
];

export const sampleIndividualReport = {
   employmentHistory: [
      { employer: "Company A", position: "Manager", startDate: "2020-01-01" },
      { employer: "Company B", position: "Developer", startDate: "2018-06-15" },
   ],
   claims: [
      { claimant: "John Doe", type: "Rent", currency: "USD", amount: 500, dateOfClaim: "2023-01-10" },
      { claimant: "Jane Smith", type: "Deposit", currency: "USD", amount: 300, dateOfClaim: "2023-02-20" },
   ],
   active: [
      { creditor: "Landlord A", type: "Residential", outstandingSince: "2023-03-01", amount: 200 },
      { creditor: "Landlord B", type: "Commercial", outstandingSince: "2023-04-15", amount: 1000 },
   ],
   historic: [
      { creditor: "Landlord C", type: "Residential", outstandingSince: "2022-05-10", amount: 150 },
      { creditor: "Landlord D", type: "Commercial", outstandingSince: "2021-08-20", amount: 800 },
   ],
   rating: "Non payer",
   personalDetails: {
      surname: "Spiwe",
      otherNames: "Jerad",
      idNumber: "47225912M47",
      dateOfBirth: "1990-01-01",
      gender: "Female",
      nationality: "Zimbabwean",
      maritalStatus: "Single",
      dependants: [
         { name: "Child A", age: 5, relationship: "Daughter" },
         { name: "Child B", age: 3, relationship: "Son" },
      ],
      mobileNumber: "071 123 4567",
      telephoneNumber: "04 123 456",
      email: "jerad.spiwe@example.com",
      address: "123 Main St, Harare, Zimbabwe",
   },
};

export const sampleIndividualRows = [
   {
      id: 1,
      forenames: "John",
      surname: "Doe",
      identificationNumber: "123456789",
   },
   {
      id: 2,
      forenames: "Jane",
      surname: "Smith",
      identificationNumber: "987654321",
   },
   {
      id: 3,
      forenames: "Alice",
      surname: "Johnson",
      identificationNumber: "456789123",
   },
   {
      id: 4,
      forenames: "Bob",
      surname: "Brown",
      identificationNumber: "321654987",
   },
   {
      id: 5,
      forenames: "Charlie",
      surname: "Davis",
      identificationNumber: "789123456",
   },
   {
      id: 6,
      forenames: "Eve",
      surname: "Wilson",
      identificationNumber: "654321789",
   },
   {
      id: 7,
      forenames: "Frank",
      surname: "Garcia",
      identificationNumber: "159753486",
   },
   {
      id: 8,
      forenames: "Grace",
      surname: "Martinez",
      identificationNumber: "753159852",
   },
   {
      id: 9,
      forenames: "Hank",
      surname: "Lopez",
      identificationNumber: "951357468",
   },
   {
      id: 10,
      forenames: "Ivy",
      surname: "Gonzalez",
      identificationNumber: "357951246",
   },
];
