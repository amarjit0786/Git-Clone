import React ,{useState,useEffect} from "react";



export default function Dashboard() {

  const [repositories,setRepositories]=useState([]);
  const [searchQuery,setSearchQuery]=useState("");
  const [suggestedRepositories,setSuggestedRepositories]=useState([]); 
  const [searchResults,setSearchResults]=useState("");

  useEffect(()=>{
    const userId = localStorage.getItem("userId");

    const fetchRepositories = async ()=>{
      try {
        const response = await fetch(`http://localhost:3000/repo/user/${userId}`);
          const data = await response.json();
          setRepositories(data.repositories);
        
      } catch (error) {
        console.error("error while fetching repositories", error);
      }  
    };
    const fetchSuggestedRepositories = async ()=>{
      try {
        const response = await fetch(`http://localhost:3000/repo/all`);
          const data = await response.json();
          // console.log(data)
          setSuggestedRepositories(data);
          console.log(suggestedRepositories);
        
      } catch (error) {
        console.error("error while fetching repositories", error);
      }  
    };

    fetchRepositories();
    fetchSuggestedRepositories();
  },[]);


  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
}