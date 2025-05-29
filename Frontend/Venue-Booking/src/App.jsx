import { useState, useEffect } from 'react'
import './App.css'

import * as urls from '../../../urls.mjs';

function App() {
  const [userInfo , checkUserInfo] = useState(null);

  useEffect(() => {
  fetch(`${urls.generalurl}${urls.getuserrole}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ userid: "23eca39" })
  })
  .then(res => res.json())
  .then(data => 
    {
      checkUserInfo({"Id" : data.content.CollegeId,"Name" : data.content.Name,"Role":data.content.Role});
    })
  .catch(err => console.error("Error fetching user role:", err));
  }, []);

  return (
    <div></div>
  );
}

export default App
