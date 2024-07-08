import { Release } from '@/app/discogsApi';
import Link from 'next/link';
import Image from 'next/image';

export const ReleaseList = ({
	currentItems,
}: {
	currentItems: Release[];
}) => {
	return (
		<div className='flex flex-wrap gap-10 justify-center w-full'>
			{currentItems?.map((item) => (
				<Link
					key={item.id}
					className='border-emerald-400 border p-4 rounded-xl flex justify-between flex-col gap-4 cursor-pointer'
					href={
						item.main_release
							? `/release/${item.main_release}`
							: `/release/${item.id}`
					}
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
		</div>
	);
};
