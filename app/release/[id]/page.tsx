import { fetchReleaseData } from "@/app/fetchRelease";
import { MasterRelease } from "@/app/discogsApi";

export default async function ReleasePage({ params }) {
  const { id } = params;
  const releaseData: MasterRelease = await fetchReleaseData(id);

  if (!releaseData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <ul>
        {releaseData.tracklist.map((item) => (
          <li key={item.title}>{item.title}</li>
        ))}
        {releaseData.community.have}
        {releaseData.country}
        {releaseData.notes}
        {releaseData.genres}
        {releaseData.artists.map((item) => (
          <li key={item.name}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
