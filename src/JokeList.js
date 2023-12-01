import React, { useEffect, useState } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";
//removed component and render
/** List of jokes. */

function JokeList({ numJokesToGet = 5 }) {
  const [jokes, setJokes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  /* retrieve jokes from API */
  useEffect(
    function () {
      async function getJokes() {
        let jks = [...jokes];
        let seenJokes = new Set();
        try {
          while (jks.length < numJokesToGet) {
            let res = await axios.get("https://icanhazdadjoke.com", {
              headers: { Accept: "application/json" },
            });
            let { ...jObj } = res.data;

            if (!seenJokes.has(jObj.id)) {
              seenJokes.add(jObj.id);
              jks.push({ ...jObj, votes: 0 });
            } else {
              console.error("duplicate found!");
            }
          }
          setJokes(jks);
          setIsLoading(false);
        } catch (err) {
          console.error(err);
        }
      }

      if (jokes.length === 0) getJokes();
    },
    [jokes, numJokesToGet]
  );

  /* empty joke list, set to loading state, and then call getJokes */

  function generateNewJokes() {
    setJokes([]);
    setIsLoading(true);
  }

  /* change vote for this id by delta (+1 or -1) */

  function vote(id, delta) {
    setJokes((allJokes) =>
      allJokes.map((j) => (j.id === id ? { ...j, votes: j.votes + delta } : j))
    );
  }

  /* render: either loading spinner or list of sorted jokes. */

  let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);
  if (isLoading) {
    return (
      <div className="loading">
        <i className="fas fa-4x fa-spinner fa-spin" />
      </div>
    );
  }

  return (
    <div className="JokeList">
      <button className="JokeList-getmore" onClick={generateNewJokes}>
        Get New Jokes
      </button>

      {sortedJokes.map(({ joke, id, votes }) => (
        <Joke text={joke} key={id} id={id} votes={votes} vote={vote} />
      ))}
    </div>
  );
}

export default JokeList;
