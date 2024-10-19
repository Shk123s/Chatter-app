import Login from "../src/components/auth/Login"
import Signup from "./components/auth/signup";
import ChatPage from "./pages/ChatPage";

import { Route, Routes } from "react-router-dom";
const App = () => {
    
  return ( 
    <div className="App" style={{backgroundColor: '#d9eeef'}}> 
    <Routes>
     {/* <Route path="/"/> */}
     <Route path="/" Component={Login}/>
     <Route path="/signup" Component={Signup}/>
     <Route path="/chats" Component={ChatPage}/>
     </Routes>
      {/* <ChatPage /> */}
    </div>
  );
};
export default App; 
