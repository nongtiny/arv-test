import { createContext } from "react";


interface IBaseContext {
  addSize: number,
  onClickAddMoreUsers: () => void
}

const addSize = 5;

// export const BaseContext = createContext<IBaseContext>({
//   addSize,
  
// });
