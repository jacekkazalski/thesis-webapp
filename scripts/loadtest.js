import http from "k6/http";
import { sleep, check } from 'k6';

export const options = {
  stages: [
    { duration: "30s", target: 5 },
    { duration: "1m", target: 20 },
    { duration: "30s", target: 0 },
  ],
};


const BASE_URL = 'http://localhost:3000/api'

function login(email, password) {
    const res = http.post(
        `${BASE_URL}/auth/login`,
        JSON.stringify({ email, password }),
        { headers: { "Content-Type": "application/json" }, tags: { name: "auth_login" } }
    );

    check(res, { "login 200": (r) => r.status === 200 });

    const body = res.json();
    return body.accessToken;
}

let accessTokenCache = null;
function checkAccessToken(id) {
    if (accessTokenCache) return;

    accessTokenCache = login(`user_${id}@seed.com`, 'Test123!');
}
export default function () {
    const id = ((__VU - 1) % 10000) + 1;
    checkAccessToken(id);
    const accessToken = accessTokenCache;
    const headers = { Authorization: `Bearer ${accessToken}` }

    const randomEndpoint = Math.random();

    if (randomEndpoint < 0.45) {
        const ings =
            [Math.floor(Math.random() * 324) + 1, Math.floor(Math.random() * 324) + 1, Math.floor(Math.random() * 324) + 1]

        const useSaved = Math.random() < 0.5 ? 1 : 0;
        const useDiet = Math.random() < 0.5 ? 1 : 0;
        const sortByOptions = ['ingredients', 'highest_rated', 'newest'];
        const sortBy = sortByOptions[Math.floor(Math.random() * sortByOptions.length)];

        const res = http.get(
            `${BASE_URL}/recipes?ingredient=${ings[0]}&ingredient=${ings[1]}&ingredient=${ings[2]}&useSaved=${useSaved}&useDiet=${useDiet}&sortBy=${sortBy}&page=1&limit=50`,
            { headers, tags: { name: "recipes_list" } }
        );
        check(res, { "recipes_list 200": (x) => x.status === 200 });
        if (res.status === 401) accessTokenCache = null;
    }
    else if (randomEndpoint < 0.60) {
        const searchTerm = Math.floor(Math.random() * 20000) + 1;
        const res = http.get(
            `${BASE_URL}/recipes?search=${searchTerm}&page=1&limit=50`,
            { headers, tags: { name: "recipes_search" } }
        );
        check(res, { "recipes_search 200": (x) => x.status === 200 });
        if (res.status === 401) accessTokenCache = null;
    }
    else if (randomEndpoint < 0.65) {
        const res = http.get(`${BASE_URL}/recipes/random`, { headers, tags: { name: "recipes_random" } });
        check(res, { "recipes_random 200": (x) => x.status === 200 });
        if (res.status === 401) accessTokenCache = null;
    }
    else if (randomEndpoint < 0.75) {
        const res = http.get(`${BASE_URL}/users/recipes?id_user=${id}`, { headers, tags: { name: "user_recipes" } });
        check(res, { "user_recipes 200": (x) => x.status === 200 });
        if (res.status === 401) accessTokenCache = null;
    } else {
        const rid = Math.floor(Math.random() * 20000) + 1;
        const res = http.get(`${BASE_URL}/favourites/check?id_recipe=${rid}`, {
            headers,
            tags: { name: "favourites_check" },
        });
        check(res, { "favourites_check 200": (x) => x.status === 200 });
        if (res.status === 401) accessTokenCache = null;
    }
    sleep(Math.random() * 0.7);
}