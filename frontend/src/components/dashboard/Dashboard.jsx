import React, { useState, useEffect } from "react";
import "./dashboard.css";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

export default function Dashboard() {
  const [repositories, setRepositories] = useState([]);
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [favoriteRepos, setFavoriteRepos] = useState({});
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const userDetails = async () => {
      const response = await fetch(
        `http://localhost:3000/userProfile/${userId}`
      );

      const userData = await response.json();
      // console.log(userData.username);
      setUserName(userData.username);
    };

    const fetchRepositories = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/repo/user/${userId}`
        );
        const data = await response.json();
        setRepositories(data.repositories);
        // console.log(data);
      } catch (error) {
        console.error("error while fetching repositories", error);
      }
    };
    const fetchSuggestedRepositories = async () => {
      try {
        const response = await fetch(`http://localhost:3000/repo/all`);
        const data = await response.json();
        // console.log(data);
        setSuggestedRepositories(data);
        // console.log("helo");
      } catch (error) {
        console.error("error while fetching repositories", error);
      }
    };

    fetchRepositories();
    fetchSuggestedRepositories();
    userDetails();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setSearchResults(repositories);
    } else {
      const filteredRepo = repositories.filter((repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setSearchResults(filteredRepo);
    }
  }, [searchQuery, repositories]);

  const toggleFavorite = async (repoId) => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch(
        `http://localhost:3000/repo/star/${repoId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        }
      );

      const data = await response.json();
      console.log(data);

      setFavoriteRepos((prevFavorites) => {
        let newFavorites = { ...prevFavorites };
        if (newFavorites[repoId]) {
          newFavorites[repoId] = false;
        } else {
          newFavorites[repoId] = true;
        }
        return newFavorites;
      });
    } catch (error) {
      console.error("Error while toggling favorite", error);
    }
  };

  return (
    <section id="dashboard">
      <aside>
        {/* all repos */}
        <h2>Suggested Repositories</h2>
        {suggestedRepositories.map((repo) => {
          return (
            <div key={repo._id}>
              <h4
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {repo.name}
                <span onClick={() => toggleFavorite(repo._id)}>
                  {favoriteRepos[repo._id] ? (
                    <FavoriteIcon color="error" />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </span>
              </h4>
              <hr />
              <p>{repo.description}</p>
            </div>
          );
        })}
      </aside>
      <main>
        <h3>
          <u> {userName}</u> Repositories
        </h3>
        <div id="search">
          <input
            type="text"
            value={searchQuery}
            placeholder="Search here.."
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {searchResults.map((repo) => {
          return (
            <div key={repo._id}>
              <h4>{repo.name}</h4>
              <hr />

              <h4>{repo.description}</h4>
            </div>
          );
        })}
      </main>

      <aside>
        <h3>Upcoming Events</h3>
        <ul>
          <li>
            <p>Tech Conference -Dec 15</p>
          </li>
          <li>
            <p>Tech Conference -Dec 15</p>
          </li>
          <li>
            <p>Tech Conference -Dec 15</p>
          </li>
          <li>
            <p>Tech Conference -Dec 15</p>
          </li>
        </ul>
      </aside>
    </section>
  );
}
