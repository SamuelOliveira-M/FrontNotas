import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";

type UsernameContextType = {
  username: string;
  setUsername: Dispatch<SetStateAction<string>>;
};

const UsernameContext = createContext<UsernameContextType>({ username: "", setUsername: () => {} });

export const useUsernameContext = () => useContext(UsernameContext);

export const UsernameContextProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [username, setUsername] = useState(localStorage.getItem("username") ?? "");

    useEffect(() => localStorage.setItem("username", username), [username]);

    return (
        <UsernameContext.Provider value={{ username, setUsername }}>
            {children}
        </UsernameContext.Provider>
    );
};
