/*
 * Links to a place and to its Redeem screen. Places built into the app have
 * their own pages (/app/place/<id>), made at build time. Places that exist
 * only in the database can't have pages in a static export, so they open the
 * same screens through one page that reads the id: /app/place/view?id=<id>.
 */
import { isBuiltInPlace } from "./store";

export const placeHref = (id: string) => (isBuiltInPlace(id) ? `/app/place/${id}` : `/app/place/view?id=${encodeURIComponent(id)}`);
export const redeemHref = (id: string) => (isBuiltInPlace(id) ? `/app/redeem/${id}` : `/app/redeem/view?id=${encodeURIComponent(id)}`);
