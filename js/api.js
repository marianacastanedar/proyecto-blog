//const URL_API = "https://dummyjson.com";
export async function getPosts() {
    try {
        const res = await fetch("https://dummyjson.com/posts");
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
        const data = await res.json();
        return data;
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