export const COUNTRIES = [
    {
      name: 'United States',
      states: [
        { name: 'California', cities: ['Los Angeles', 'San Francisco', 'San Diego'] },
        { name: 'New York', cities: ['New York City', 'Buffalo', 'Rochester'] },
        // Add more states and cities as needed
      ],
    },
    {
      name: 'United Kingdom',
      states: [
        { name: 'England', cities: ['London', 'Manchester', 'Birmingham'] },
        { name: 'Scotland', cities: ['Edinburgh', 'Glasgow', 'Aberdeen'] },
        // Add more states and cities as needed
      ],
    },
    // Add more countries as needed
];

export const PHONE_REGEX = /^\d{10}$/

export const BUTTONTEXT = {
  next:'Next',
  regCheckIn:'Register & checkIn'
}

export const ROUTES = {
  preReg:'pre-registration',
  regChe:'regster-checkIn'
}

export const checkInMessages = {
  accepted: 'This check-in request is accepted. This visitor is able to check-in.',
  denied: 'This check-in request is denied. This visitor is not allowed to check-in!'
};
