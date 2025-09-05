import React, { createContext,useState } from 'react'
 
export const UserContext = createContext(); 

const UserProvider = ({children}) => { 
  useState
   const [user,setUser] = useState(false);  
   const toggleUser = ()=>{
        setUser((prev)=>!prev);
   }

  return (
     <UserContext.Provider value={{user,toggleUser}}>
          {children}
     </UserContext.Provider>
  )
}

export default UserProvider
