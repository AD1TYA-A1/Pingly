// app/sitemap.js
//
// Auto-generates sitemap.xml for adm1n-chats.
// Next.js picks up this file automatically and serves it at:
// https://adm1n-chats.vercel.app/sitemap.xml
//
// Purpose: tells search engines which pages exist, how important
// each one is, and how often they're likely to change — so Google
// crawls and indexes the site faster and more accurately.

//HELPFUL IN SITEMAPPING WHILE REGISTERING MY WEBSITE INTO GOOGLE SEARCH CONSOLE

export default function sitemap() {
    const baseUrl = "https://adm1n-chats.vercel.app";

    return [
        {
            url: `${baseUrl}/`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${baseUrl}/logIn`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/signUp`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/explore`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
        },
    ];
}