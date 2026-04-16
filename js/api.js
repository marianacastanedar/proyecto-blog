export async function getPosts({ limit = 10, skip = 0 } = {}) {
        const res = await fetch(`https://dummyjson.com/posts?limit=${limit}&skip=${skip}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
    return { posts: data.posts, total: data.total };
}

export async function getPostById(id) {
        const res = await fetch(`https://dummyjson.com/posts/${id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
}

export async function getUserById(id) {
    const res = await fetch(`https://dummyjson.com/users/${id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json(); 
}

export async function searchUsers(query) {
    const res = await fetch(`https://dummyjson.com/users/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return { users: data.users, total: data.total };
}

export async function getPostsByUserId(userId) {
    const res = await fetch(`https://dummyjson.com/posts/user/${userId}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return { posts: data.posts, total: data.total };
}

export async function searchPosts(query) {
    const res = await fetch(`https://dummyjson.com/posts/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return { posts: data.posts, total: data.total };
}

export async function getPostsByTag(tag) {
    const res = await fetch(`https://dummyjson.com/posts/tag/${encodeURIComponent(tag)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return { posts: data.posts, total: data.total };
}
 
export async function getTags() {
        const res = await fetch("https://dummyjson.com/posts/tags");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
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
    return await res.json();
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
    return await res.json();
}

export async function deletePost(id) {
    const res = await fetch(`https://dummyjson.com/posts/${id}`, {
        method: "DELETE"
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
}