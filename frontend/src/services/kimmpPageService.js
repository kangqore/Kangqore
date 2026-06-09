// ---------------------------------------------------------------------------
// KIMMP Page Factory — frontend API client (PR-A2)
//
// Talks to the PR-A1 backend rails. `axios` carries the Authorization header
// globally (set by AuthContext on login), so admin calls authenticate without
// extra wiring. The /rendered endpoint is public.
// ---------------------------------------------------------------------------

import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';
const API = `${BACKEND_URL}/api/admin/kangqore-immp/page-factory`;

/** Public — fetch a PUBLISHED page by slug (used by the renderer). */
export const getRenderedPage = async (slug) => {
  const res = await axios.get(`${API}/rendered/${slug}`);
  return res.data.page;
};

/** Admin — list pages, optional { status, pageType } filter. */
export const listPages = async (params = {}) => {
  const res = await axios.get(`${API}/pages`, { params });
  return res.data; // { pages, count }
};

/** Admin — fetch one page (any status). */
export const getPage = async (id) => {
  const res = await axios.get(`${API}/pages/${id}`);
  return res.data.page;
};

/** Admin — create a DRAFT page. */
export const createPage = async (payload) => {
  const res = await axios.post(`${API}/pages`, payload);
  return res.data.page;
};

/** Admin — update a page's content/metadata. */
export const updatePage = async (id, payload) => {
  const res = await axios.patch(`${API}/pages/${id}`, payload);
  return res.data.page;
};

/** Admin — publish a page. */
export const publishPage = async (id) => {
  const res = await axios.post(`${API}/pages/${id}/publish`);
  return res.data.page;
};

/** Admin — return a page to DRAFT. */
export const unpublishPage = async (id) => {
  const res = await axios.post(`${API}/pages/${id}/unpublish`);
  return res.data.page;
};

/** Admin — allowed page types & statuses. */
export const getPageMeta = async () => {
  const res = await axios.get(`${API}/meta`);
  return res.data; // { pageTypes, statuses }
};
