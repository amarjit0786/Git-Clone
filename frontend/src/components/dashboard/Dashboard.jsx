import React, { useState, useEffect } from "react";
import "./dashboard.css"

export default function Dashboard() {
  const [repositories, setRepositories] = useState([]);
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchRepositories = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/repo/user/${userId}`
        );
        const data = await response.json();
        setRepositories(data.repositories);
      } catch (error) {
        console.error("error while fetching repositories", error);
      }
    };
    const fetchSuggestedRepositories = async () => {
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
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setSearchResults(repositories);
    } else {
      const filteredRepo = repositories.filter((repo) => {
        repo.name.toLowerCase().includes(searchQuery.toLowerCase());
      });

      setSearchResults(filteredRepo);
    }
  }, [searchQuery, repositories]);

  return (
   <section id="dashboard">
    <aside>
      {/* all repos */}
      <h2>Suggested Repositories</h2>
      {suggestedRepositories.map((repo)=>{
        return (
          <div key={repo._id}>
            <h4>{repo.name}</h4>
            <p>{repo.description}</p>
          </div>
        )
      })}
    </aside>
    <main>
      <h2>Your Repositories</h2>
      {repositories.map((repo)=>{
        return (
          <div key={repo._id}>
            <h4>{repo.name}</h4>
            <h4>{repo.description}</h4>
          </div>
        )
      })}
    </main>
    <aside>
      <h3>Upcoming Events</h3>
      <ul>
        <li><p>Tech Conference -Dec 15</p></li>
        <li><p>Tech Conference -Dec 15</p></li>
        <li><p>Tech Conference -Dec 15</p></li>
        <li><p>Tech Conference -Dec 15</p></li>
      </ul>
    </aside>
   </section>
  );
}
