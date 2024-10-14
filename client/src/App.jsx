import Login from "../src/components/login/Login"
import ChatPage from "./pages/ChatPage";

import { Route, Routes } from "react-router-dom";
const App = () => {
    
  return ( 
    <div className="App"> 
    <Routes>
     {/* <Route path="/"/> */}
     <Route path="/" Component={Login}/>

     <Route path="/chats" Component={ChatPage}/>
     </Routes>
      {/* <ChatPage /> */}
    </div>
  );
};
export default App; 
