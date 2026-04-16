export async function getPosts({ limit = 10, skip = 0 } = {}) {
    try {
        const res = await fetch(`https://dummyjson.com/posts?limit=${limit}&skip=${skip}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        return data.posts;
    } catch (error) {
        console.error("Error al conectar con la API: ", error);
        return [];
    }
}

export async function getPostById(id) {
    try {
        const res = await fetch(`https://dummyjson.com/posts/${id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
    } catch (error) {
        console.error("Error al obtener el post: ", error);
        throw error;
    }
}

export async function getUserById(id) {
    try {
        const res = await fetch(`https://dummyjson.com/users/${id}`);
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error al obtener el usuario: ", error);
        throw error;
    }
}

export async function createPost(titulo, autor, contenido) {
    const res = await fetch("https://dummyjson.com/posts/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title: titulo,
            body: contenido,
            userId: 1,
            tags: [],
            reactions: { likes: 0, dislikes: 0 }
        })
    });

    if (!res.ok) throw new Error("Error al crear el post");

    const data = await res.json();
    return data;
}

export async function updatePost(id, titulo, autor, contenido) {
    const res = await fetch(`https://dummyjson.com/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title: titulo,
            body: contenido,
            userId: autor
        })
    });
 
    if (!res.ok) throw new Error("Error al actualizar el post");
 
    const data = await res.json();
    return data;
}


export async function searchPosts(query) {
    try {
        const res = await fetch(`https://dummyjson.com/posts/search?q=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        return { posts: data.posts, total: data.total };
    } catch (error) {
        console.error("Error al buscar posts: ", error);
        throw error;
    }
}
 

export async function getPostsByTag(tag) {
    try {
        const res = await fetch(`https://dummyjson.com/posts/tag/${encodeURIComponent(tag)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        return { posts: data.posts, total: data.total };
    } catch (error) {
        console.error("Error al filtrar por tag: ", error);
        throw error;
    }
}
 

export async function getTags() {
    try {
        const res = await fetch("https://dummyjson.com/posts/tags");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
    } catch (error) {
        console.error("Error al obtener los tags: ", error);
        throw error;
    }
}
 
export async function deletePost(id) {
    try {
        const res = await fetch(`https://dummyjson.com/posts/${id}`, {
            method: "DELETE"
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
    } catch (error) {
        console.error("Error al eliminar el post: ", error);
        throw error;
    }
}