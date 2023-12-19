import { AxiosResponse } from 'axios';
import { apiClient } from '../services';
import { TUserResponse } from '../types/response';

export const UserService = {
  getRandomUsers(config?: {
    size?: number
  }): Promise<AxiosResponse<TUserResponse[]>> {
    if (!config) {
      return apiClient.get('/users/random_user?size=5')
    }
    return apiClient.get(`/users/random_user?size=${config.size}`)
  }
}