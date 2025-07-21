export default function useAddressFormFields() {
   const cities = [
      { id: 1, name: "Harare" },
      { id: 2, name: "Bulawayo" },
      { id: 3, name: "Chitungwiza" },
   ];

   const countries = [
      { id: 1, name: "Zimbabwe" },
      { id: 2, name: "South Africa" },
      { id: 3, name: "Botswana" },
   ];

   const provinces = [
      { id: 1, name: "Harare" },
      { id: 2, name: "Bulawayo" },
      { id: 3, name: "Mashonaland East" },
   ];

   const suburbs = [
      { id: 1, name: "Avondale" },
      { id: 2, name: "Borrowdale" },
      { id: 3, name: "Greendale" },
   ];

   return { countries, provinces, cities, suburbs };
}
