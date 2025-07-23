import axios from "axios";

const API_KEY =   "61628c4e3223a1bf07cb224fc9928918";
const BASE_URL = "https://api.themoviedb.org/3";

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

export default api;
export async function getRequestToken() {
  const res = await api.get("/authentication/token/new");
  return res.data.request_token;
}

export async function createSession(requestToken: string) {
  const res = await api.post("/authentication/session/new", { request_token: requestToken });
  return res.data.session_id;
}

export async function getAccountDetails(sessionId: string) {
  const res = await api.get("/account", { params: { session_id: sessionId } });
  return res.data; // contains id, username, etc.
}

export async function getFavoriteMovies(accountId: number, sessionId: string) {
  const res = await api.get(`/account/${accountId}/favorite/movies`, {
    params: { session_id: sessionId }
  });
  return res.data.results; // array of favorite movies
}