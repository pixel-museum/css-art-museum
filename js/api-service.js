const BACKEND_URL = "https://css-art-museum-backend.onrender.com";

async function fetchWithRetry(url, options = {}, maxRetries = 3) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response; // Return response, not response.json()
        } catch (error) {
            if (attempt === maxRetries) {
                console.error(`Failed after ${maxRetries} retries:`, error);
                throw error;
            }
            
            // Exponential backoff: 1s, 2s, 4s
            const delay = Math.pow(2, attempt) * 1000;
            console.log(`Retry attempt ${attempt + 1} after ${delay}ms`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}
async function getAllArtworksApi() {
    try {
        const response = await fetchWithRetry(`${BACKEND_URL}/api/artworks/all`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching all artworks:", error);
        return [];
    }
}


async function getAllArtworksIdsApi(id) {
    try {
        const encodedId = encodeURIComponent(id);
        const response = await fetchWithRetry(`${BACKEND_URL}/api/artworks/one/${encodedId}`)
        console.log("Fetched artwork IDs:", response);
        return await response.json();
    } catch (error) {
        console.error("Error fetching artwork IDs:", error);
        return [];
    }
}


async function addArtworkApi(id) {
    try {
        const encodedId = encodeURIComponent(id);
        const response = await fetchWithRetry(`${BACKEND_URL}/api/artworks/add/${encodedId}`, {
            method: 'POST',
        });
        // Handle 409 (conflict) as non-error
        if (response.status === 409) {
            return await response.json();
        }
        return await response.json();
    } catch (error) {
        console.error(`Error adding artwork ${id}:`, error);
        return null;
    }
}


async function likeArtworkApi(id) {
    try {
        const encodedId = encodeURIComponent(id);
        const response = await fetchWithRetry(`${BACKEND_URL}/api/artworks/like/${encodedId}`, {
            method: 'PUT',
        });
        return await response.json();
    } catch (error) {
        console.error(`Error liking artwork ${id}:`, error);
        return null;
    }
}

async function unlikeArtworkApi(id) {
    try {
        const encodedId = encodeURIComponent(id);
        const response = await fetchWithRetry(`${BACKEND_URL}/api/artworks/unlike/${encodedId}`, {
            method: 'PUT',
        });
        return await response.json();
    } catch (error) {
        console.error(`Error unliking artwork ${id}:`, error);
        return null;
    }
}


async function syncArtworks(localArtworks) {
    const backendArtworks = await getAllArtworksApi();
    console.log("Backend Artworks:", backendArtworks);
    const backendIds = new Set(backendArtworks.map(art => art.id));
    const newArtworks = localArtworks.filter(art => !backendIds.has(art.id));

    if (newArtworks.length > 0) {
        await Promise.all(newArtworks.map(art => addArtworkApi(art.id)));
    }
}

async function initializePage() {
    try {
        const response = await fetchWithRetry('./arts.json');
        const localArtworksData = await response.json();
        const localArtworks = localArtworksData.map(art => ({ ...art, id: art.file }));

        await syncArtworks(localArtworks);
    } catch (error) {
        console.error("Initialization failed:", error);
    }
}

document.addEventListener('DOMContentLoaded', initializePage);

