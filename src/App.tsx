import React, { useEffect, useState, useRef } from "react";
import logo from "./logo.svg";
import "./App.css";
import { vaccineDemo } from "./components/VaccineDemo";

import { AccountService } from "@trinsic/trinsic/browser";

const accountService = new AccountService();

function App() {
  // instantiate object with fields accountInfo, auhtToken
  const [info, setInfo] = useState({ accountInfo: "", authToken: "" });
  const [counter, setCounter] = useState(0);

  // loads on application load
  useEffect (() => {
    console.log(counter);
    if(counter >= 1) {
      vaccineDemo();
    } else {
      setCounter(counter+1);
    }

    // implement getAuthToken to query
    // const getAuthToken = async () => {
    //   // call trinsic sdk calls 
    //   // create anonymous
    //   const authToken = await accountService.loginAnonymous();
    //   const accountInfo = await accountService.getInfo();

    //   // update state object with new values
    //   setInfo({
    //     accountInfo: JSON.stringify(accountInfo, null, 4),
    //     authToken: authToken,
    //   });
    // };

    // // call function and catch error if returned 
    // getAuthToken().catch((e) => console.error(e));
  });

  return (
    <div className="App">
      <header className="App-header">
        {
          <div>
            <p>View Vaccine Demo in Developers Tools Console Log: CMD + SHIFT + J for Chrome, Edge</p>
          </div>
        }
      </header>
    </div>
  );
}

export default App;
