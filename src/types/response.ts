export type TUserAddress = {
  city: string,
  street_name: string,
  street_address: string,
  zip_code: string,
  state: string,
  country: string,
  coordinates: {
    lat: number,
    lng: number
  }
}

export type TUserResponse = {
  id: number,
  uid: string,
  password: string,
  first_name: string,
  last_name: string,
  username: string,
  email: string,
  avatar: string,
  gender: string,
  phone_number: string,
  social_insurance_number: number,
  date_of_birth: string,
  employment: {
    title: string,
    key_skill: string
  },
  address: TUserAddress,
  credit_card: {
    c_number: number
  },
  subscription: {
    plan: string,
    status: string,
    payment_method: string,
    term: string
  }
}
export type TUserResponseKey = keyof TUserResponse;