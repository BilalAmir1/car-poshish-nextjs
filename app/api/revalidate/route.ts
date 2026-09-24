import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

// Called automatically by the Strapi CMS (see car-poshish-cms/src/index.js)
// the instant any watched content type changes. Protected by a shared
// secret so random requests can't force cache invalidation. Both GET and
// POST are accepted since it's trivial to test by just opening the URL in
// a browser during setup — real traffic here is a CMS-triggered POST.
export async function POST(request: Request) {
  return handleRevalidate(request);
}

export async function GET(request: Request) {
  return handleRevalidate(request);
}

function handleRevalidate(request: Request) {
  const secret = new URL(request.url).searchParams.get("secret");
  const expected = process.env.REVALIDATE_SECRET;

  if (!expected) {
    return NextResponse.json(
      { error: "REVALIDATE_SECRET is not configured on this site" },
      { status: 500 }
    );
  }
  if (secret !== expected) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  revalidateTag("cms-content");
  return NextResponse.json({ revalidated: true, now: Date.now() });
}
