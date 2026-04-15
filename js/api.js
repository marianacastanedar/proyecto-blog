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
