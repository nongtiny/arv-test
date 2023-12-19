import { TUserResponse } from './response';
export interface ICardUser {
  user: TUserResponse | null,
  onSelectAddress?: (userAddress: TUserResponse) => void,
}