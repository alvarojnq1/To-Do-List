import { useState } from "react";

import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="bg-gray-500 w-screen h-screen flex flex-col justify-center items-center">
        <p className="text-white text-2xl">Hello World</p>
      </div>
    </>
  );
}

export default App;
