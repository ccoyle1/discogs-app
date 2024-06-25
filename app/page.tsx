"use client";

import { useState } from "react";
import Image from "next/image";

interface Artist {
  name: string;
  id?: number;
}

interface Stats {
  community: {
    in_collection: number;
    in_wantlist: number;
  };
}

interface Release {
  stats?: Stats;
  thumb?: string;
  title?: string;
  main_release?: number;
  artist: string;
  role?: string;
  year?: number;
  resource_url?: string;
  type?: "master";
  id?: number;
}

interface Releases {
  releases: Release[];
}

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

    console.log(release?.releases);
    // fetchReleaseInfo();
  };

  // function fetchReleaseInfo() {
  //   release?.releases.map((item) =>
  //     fetch(`https://api.discogs.com/releases/${item.id}`, {
  //       method: "GET",
  //       headers: {
  //         Authorization: `Discogs key=${process.env.NEXT_PUBLIC_DISCOGS_KEY}, secret=${process.env.NEXT_PUBLIC_DISCOGS_SECRET}`,
  //       },
  //     }).then((response) => response.json().then((data) => console.log(data)))
  //   );

  //   // const response = fetch(`https://api.discogs.com/releases/${item.id}`)
  //   // .then((response) => response.json())
  //   // .then((data) => {return { ...item, additionalData: data };})
  // }

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
