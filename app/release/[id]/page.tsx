import { fetchReleaseData } from "@/app/fetchRelease";
import { MasterRelease } from "@/app/discogsApi";
import Image from "next/image";

export default async function ReleasePage({ params }: { params: { id: string }}) {
  const { id } = params;
  
  const releaseData: MasterRelease = await fetchReleaseData(id);

  if (!releaseData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-12 md:p-24 flex items-center md:items-start md:flex-row flex-col gap-4">
      <div className="flex flex-col gap-4">
          {releaseData?.images?.map((item) => (
            <Image
              className="max-w-[300px] px-4"
              key={item.uri}
              src={item.resource_url}
              alt={item.uri}
              width={item.width}
              height={item.height}
            />
          ))}
      </div>
      <div className="flex flex-col gap-4">
        {releaseData.artists.map((item) => (
          <h1 className="text-2xl font-bold text-emerald-400" key={item.name}>
            {item.name} - {releaseData.title}
          </h1>
        ))}
        <div>
            <h2 className="text-xl font-bold">Country</h2>
          <span>{releaseData.country}</span>
        </div>
        <div>
        <h2 className="text-xl font-bold">Genre</h2>
          <span>{releaseData.genres}</span>
        </div>
        <ul>
        <h2 className="text-xl font-bold">Tracklist</h2>
          {releaseData.tracklist.map((item) => (
            <li key={item.title}>{item.title}</li>
          ))}
        </ul>
        <div>
          <h2 className="text-xl font-bold">Release Notes</h2>
          <p>{releaseData.notes}</p>
        </div>
      </div>
      <div className="flex flex-col align-start justify-start">
        <h2 className="text-xl font-bold">Community</h2>
        <span>Have: {releaseData.community.have}</span>
        <span>Want: {releaseData.community.want}</span>
        <span>Rating: {releaseData.community.rating.average}</span>
      </div>
    </div>
  );
}
