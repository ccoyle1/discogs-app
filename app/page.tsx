"use client";

import { useState } from "react";
import { Artist, Releases } from "./discogsApi";
import Image from "next/image";

export default function Search() {
  const [artist, setArtist] = useState<Artist>();
  const [artistId, setArtistId] = useState();
  const [release, setRelease] = useState<Releases>();

  const handleSubmit = () => {
    fetch(
      `https://api.discogs.com/database/search?type=artist&q=${artist?.name}&key=${process.env.NEXT_PUBLIC_DISCOGS_KEY}&secret=${process.env.NEXT_PUBLIC_DISCOGS_SECRET}`
    )
      .then((response) => response.json())
      .then(
        (data) => setArtistId(
          data.results.find(
            (item: { title: string | undefined }) => item.title === artist?.name
          )?.id)
      )
      .then(() =>
        fetch(
          `https://api.discogs.com/artists/${artistId}/releases?page=1&per_page=5`,
          {
            method: "GET",
            headers: {
              Authorization: `Discogs key=${process.env.NEXT_PUBLIC_DISCOGS_KEY}, secret=${process.env.NEXT_PUBLIC_DISCOGS_SECRET}`,
            },
          }
        )
          .then((response) => response.json())
          .then((result) => setRelease(result))
      );
  };

  return (
    <div className="App">
      <label htmlFor="string">Search</label>
      <input
      className="text-black"
        id="string"
        placeholder="Enter word..."
        type="string"
        onChange={(event) => setArtist({ name: event.target.value })}
      ></input>
      <button className="fa fa-search" type="submit" onClick={handleSubmit}>
        Submit
      </button>
      <h1>{release?.releases.map((item) => item.title)}</h1>
      {release?.releases.map((item) => (
        <a key={item.id} href={`/release/${item.id}`}>
          <span>{item.id}</span>
          <span>{item.artist}</span>
          <Image src={item.thumb ?? ""} alt={item.title ?? ""} width={200} height={200} />
        </a>
      ))}
    </div>
  );
}
