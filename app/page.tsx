'use client';

import { useEffect, useState } from 'react';
import { Artist, Releases } from './discogsApi';
import { Search } from '@/components/Search';
import { ReleaseList } from '@/components/ReleaseList';

const numOfItems = 5;

export default function Page() {
	const [artist, setArtist] = useState<Artist>();
	const [artistId, setArtistId] = useState<string | undefined | null>(
		undefined,
	);
	const [currentPage, setCurrentPage] = useState(1);
	const [release, setRelease] = useState<Releases>();

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
				<Search handleSearch={handleSubmit} />
			</div>

			{currentItems.length > 0 ? (
				<>
					<ReleaseList currentItems={currentItems} />
					<div className='flex w-full items-center justify-center gap-10'>
						{currentPage > 1 ? (
							<>
								<button
									onClick={() => setCurrentPage((activePage) => activePage - 1)}
								>
									Prev
								</button>
								<span>{currentPage}</span>
							</>
						) : null}
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
				</>
			) : (
				<span>No results for artist: {artist?.name}</span>
			)}

			{/* {artistId === null ? (
					<span>No results found for {artist?.name}</span>
				) : null}
				{hasNoResults ? (
					<span>No results for artist: {artist?.name}</span>
				) : null} */}
		</div>
	);
}
