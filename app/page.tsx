'use client';
import { useRouter } from 'next/navigation';
import { MouseEvent, useEffect, useState } from 'react';
import { Artist, Releases } from './discogsApi';
import Image from 'next/image';
import Link from 'next/link';

const numOfItems = 5;

export default function Search() {
	const router = useRouter();
	const [artist, setArtist] = useState<Artist>();
	const [artistId, setArtistId] = useState<string | undefined | null>(
		undefined,
	);
	const [currentPage, setCurrentPage] = useState(1);
	const [release, setRelease] = useState<Releases>();
	const [hasNoResults, setHasNoResults] = useState(false);

	const handleSubmit = () => {
		setCurrentPage(1);
		fetch(
			`https://api.discogs.com/database/search?type=artist&q=${artist?.name}`,
			{
				method: 'GET',
				headers: {
					Authorization: `Discogs key=${process.env.NEXT_PUBLIC_DISCOGS_KEY}, secret=${process.env.NEXT_PUBLIC_DISCOGS_SECRET}`,
				},
			},
		)
			.then((response) => response.json())
			.then((data) => {
				const foundArtistId = data.results.find(
					(item: { title: string | undefined }) =>
						item.title?.toLowerCase() === artist?.name.toLowerCase(),
				)?.id;
				if (foundArtistId) {
					setArtistId(foundArtistId);
				} else {
					setArtistId(null);
				}
			})
			.catch((error) => console.log(error));
	};

	useEffect(() => {
		if (artistId) {
			fetch(
				`https://api.discogs.com/artists/${artistId}/releases?page=
      ${currentPage}&per_page=${numOfItems}`,
				{
					method: 'GET',
					headers: {
						Authorization: `Discogs key=${process.env.NEXT_PUBLIC_DISCOGS_KEY}, secret=${process.env.NEXT_PUBLIC_DISCOGS_SECRET}`,
					},
				},
			)
				.then((response) => response.json())
				.then((result) => {
					setRelease(result);
					if (result.releases.length === 0) {
						setHasNoResults(true);
					}
				})
				.catch((error) => console.log(error));
		}
	}, [artistId, currentPage]);

	const totalPages = Math.ceil((release?.pagination?.items ?? 1) / numOfItems);
	const currentItems = release?.releases ?? [];

	return (
		<div className='p-12 md:p-24 flex items-center md:items-start flex-col gap-10 justify-center m-auto w-full'>
			<div className='flex gap-2 flex-col m-auto items-center'>
				<h1 className='text-2xl font-bold m-auto text-emerald-400'>
					Discogs Search App
				</h1>
				<label htmlFor='string' className='text-lg font-bold'>
					Search
				</label>
				<input
					className='text-black h-8'
					id='string'
					placeholder='Enter artist...'
					type='string'
					onChange={(event) => setArtist({ name: event.target.value })}
				></input>
				<button
					className='bg-emerald-400 w-32 h-12 rounded-lg'
					type='submit'
					onClick={handleSubmit}
				>
					Submit
				</button>
			</div>

			<div className='flex flex-wrap gap-10 justify-center w-full'>
				{currentItems?.map((item) => (
					<Link
						key={item.id}
						className='border-emerald-400 border p-4 rounded-xl flex justify-between flex-col gap-4 cursor-pointer'
						href={item.main_release ? `/release/${item.main_release}` : `/release/${item.id}`}
					>
						<div className='m-auto'>
							<Image
								src={item.thumb ?? ''}
								alt={item.title ?? ''}
								width={200}
								height={200}
							/>
						</div>
						<div>
							<h1>{item.title}</h1>
							<span>{item.artist}</span>
						</div>
					</Link>
				))}
				{artistId === null ? (
					<span>No results found for {artist?.name}</span>
				) : null}
				{hasNoResults ? (
					<span>No results for artist: {artist?.name}</span>
				) : null}
				{currentItems.length > 0 && (
          <div className="flex w-full items-center justify-center gap-10">
            {currentPage > 1 ? (
              <button
                onClick={() => setCurrentPage((activePage) => activePage - 1)}
              >
                Prev
              </button>
            ) : null}
            <span>{currentPage}</span>
            {currentPage < totalPages ? (
              <>
                {currentPage + 1 < totalPages ? (
                  <button
                    onClick={() =>
                      setCurrentPage((activePage) => activePage + 1)
                    }
                  >
                    {currentPage + 1}
                  </button>
                ) : null}
                <button onClick={() => setCurrentPage(totalPages)}>
                  {totalPages}
                </button>
                <button
                  onClick={() => setCurrentPage((activePage) => activePage + 1)}
                >
                  Next
                </button>
              </>
            ) : null}
          </div>
        )}
			</div>
		</div>
	);
}
