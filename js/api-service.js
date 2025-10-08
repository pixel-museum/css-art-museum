const BACKEND_URL = "https://css-art-museum-backend.onrender.com";

async function getAllArtworksApi() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/artworks/all`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching all artworks:", error);
        return [];
    }
}

async function getAllArtworksIdsApi(id) {
    try {
        const encodedId = encodeURIComponent(id);
        const response = await fetch(`${BACKEND_URL}/api/artworks/one/${encodedId}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
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
        const response = await fetch(`${BACKEND_URL}/api/artworks/add/${encodedId}`, {
            method: 'POST',
        });
        if (!response.ok && response.status !== 409) {
            throw new Error(`HTTP error! status: ${response.status}`);
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
        const response = await fetch(`${BACKEND_URL}/api/artworks/like/${encodedId}`, {
            method: 'PUT',
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`Error liking artwork ${id}:`, error);
        return null;
    }
}

async function unlikeArtworkApi(id) {
    try {
        const encodedId = encodeURIComponent(id);
        const response = await fetch(`${BACKEND_URL}/api/artworks/unlike/${encodedId}`, {
            method: 'PUT',
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
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
        const response = await fetch('./arts.json');
        if (!response.ok) throw new Error('arts.json not found');
        
        const localArtworksData = await response.json();
        const localArtworks = localArtworksData.map(art => ({ ...art, id: art.file }));

        await syncArtworks(localArtworks);
    } catch (error) {
        console.error("Initialization failed:", error);
    }
}

document.addEventListener('DOMContentLoaded', initializePage);

