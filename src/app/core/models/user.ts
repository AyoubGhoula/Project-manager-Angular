export interface User {
  id: number | string;
  nom: string;
  prenom: string;
  email: string;
  role: string;
}

export interface UserRecord extends User {
  password: string;
}

export interface RegisterPayload {
  nom: string;
  prenom: string;
  email: string;
  role: string;
  password: string;
}
