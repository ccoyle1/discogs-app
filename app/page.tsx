"use client";
import { useRouter } from "next/navigation";
import { MouseEvent, useEffect, useState } from "react";
import { Artist, Releases } from "./discogsApi";
import Image from "next/image";

export default function Search() {
  const router = useRouter();
  const [artist, setArtist] = useState<Artist>();
  const [artistId, setArtistId] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [release, setRelease] = useState<Releases>();

  const handleSubmit = () => {
    fetch(
      `https://api.discogs.com/database/search?type=artist&q=${artist?.name}`,
      {
        method: "GET",
        headers: {
          Authorization: `Discogs key=${process.env.NEXT_PUBLIC_DISCOGS_KEY}, secret=${process.env.NEXT_PUBLIC_DISCOGS_SECRET}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) =>
        setArtistId(
          data.results.find(
            (item: { title: string | undefined }) => item.title === artist?.name
          )?.id
        )
      );
  };

  useEffect(() => {
    fetch(
      `https://api.discogs.com/artists/${artistId}/releases?page=
      ${currentPage}`,
      {
        method: "GET",
        headers: {
          Authorization: `Discogs key=${process.env.NEXT_PUBLIC_DISCOGS_KEY}, secret=${process.env.NEXT_PUBLIC_DISCOGS_SECRET}`,
        },
      }
    )
      .then((response) => response.json())
      .then((result) => setRelease(result));
  }, [artistId, currentPage]);

  const totalPages = Math.ceil(release?.pagination?.items / 5);
  const startIndex = (currentPage - 1) * 5;
  const endIndex = startIndex + 5;
  const currentItems = release?.releases.slice(startIndex, endIndex);

  const handleClick = (e: MouseEvent, path: string) => {
    e.preventDefault();

    router.push(path);
  };

  return (
    <div className="p-12 md:p-24 flex items-center md:items-start flex-col gap-10 justify-center m-auto w-full">
      <div className="flex gap-2 flex-col m-auto items-center">
        <h1 className="text-2xl font-bold m-auto text-emerald-400">
          Discogs Search App
        </h1>
        <label htmlFor="string" className="text-lg font-bold">
          Search
        </label>
        <input
          className="text-black h-8"
          id="string"
          placeholder="Enter artist..."
          type="string"
          onChange={(event) => setArtist({ name: event.target.value })}
        ></input>
        <button
          className="bg-emerald-400 w-32 h-12 rounded-lg"
          type="submit"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>

      <div className="flex flex-wrap gap-10 justify-center w-full">
        {currentItems?.map((item) => (
          <div
            key={item.id}
            className="border-emerald-400 border p-4 rounded-xl flex justify-between flex-col gap-4"
            onClick={(e) => handleClick(e, `/release/${item.main_release}`)}
          >
            <div className="m-auto">
              <Image
                src={item.thumb ?? ""}
                alt={item.title ?? ""}
                width={200}
                height={200}
              />
            </div>
            <div>
              <h1>{item.title}</h1>
              <span>{item.artist}</span>
            </div>
          </div>
        ))}
        {currentItems && (
          <div className="flex w-full items-center justify-center gap-10">
            <button onClick={() => setCurrentPage(currentPage - 1)}>
              Prev
            </button>
            <span>{currentPage}</span>
            <button onClick={() => setCurrentPage(currentPage + 1)}>
              {currentPage + 1}
            </button>
            <button onClick={() => setCurrentPage(totalPages)}>
              {totalPages}
            </button>
            <button onClick={() => setCurrentPage(currentPage + 1)}>
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
