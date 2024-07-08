export const Search = ({handleSearch}: {handleSearch: () => void}) => {
	return (
		<button
			className='bg-emerald-400 w-32 h-12 rounded-lg'
			type='submit'
			onClick={handleSearch}
		>
			Submit
		</button>
	);
};
