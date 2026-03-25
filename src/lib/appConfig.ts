// Bu proje GitHub Pages gibi statik ortamlarda çalışacağı için tüm tercihler istemci tarafında tutulur.
export const AUTH_ENABLED = process.env.NEXT_PUBLIC_ENABLE_LOCAL_AUTH === 'true';

export const GA_MEASUREMENT_ID =
	process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-N3SFG0BFJ5';