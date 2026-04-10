// Correspond exactement à la réponse de
// https://jsonplaceholder.typicode.com/users

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

// Ce qu'on stocke en session après connexion
export interface AuthUser {
  id: number;
  name: string;
  username: string;
  email: string;
  initials: string; // ex: "KF" pour "Kouadio Ferdinand"
}
