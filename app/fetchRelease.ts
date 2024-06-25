export async function fetchReleaseData(releaseId: string) {
    const apiKey = process.env.NEXT_PUBLIC_DISCOGS_KEY;
    const apiSecret = process.env.NEXT_PUBLIC_DISCOGS_SECRET;
  
    const url = `https://api.discogs.com/releases/${releaseId}`;
  
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `Discogs key=${apiKey}, secret=${apiSecret}`,
          },
        next: { revalidate: 3600 } // Revalidate every hour
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      return response.json();
    } catch (error) {
      console.error('Error fetching release data:', error);
      return null;
    }
  }