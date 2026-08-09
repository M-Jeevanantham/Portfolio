import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username") || "M-Jeevanantham";

  const EMPTY_STATS = {
    username: username,
    name: username,
    avatar: `https://github.com/${username}.png`,
    bio: "",
    followers: 0,
    following: 0,
    publicRepos: 0,
    totalStars: 0,
    totalForks: 0,
    recentPushes: 0,
    topLanguages: [],
    profileUrl: `https://github.com/${username}`,
  };

  try {
    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "portfolio-app",
    };

    const [userRes, reposRes, eventsRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, { headers, cache: "no-store" }),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100&type=owner`, { headers, cache: "no-store" }),
      fetch(`https://api.github.com/users/${username}/events/public?per_page=100`, { headers, cache: "no-store" }),
    ]);

    if (!userRes.ok) {
      return NextResponse.json(EMPTY_STATS, { headers: NO_CACHE_HEADERS });
    }

    const user = await userRes.json();
    const repos = reposRes.ok ? await reposRes.json() : [];
    const events = eventsRes.ok ? await eventsRes.json() : [];

    const now = Date.now();
    const ninetyDaysAgo = now - 90 * 24 * 60 * 60 * 1000;
    const recentPushes = Array.isArray(events)
      ? events.filter(
          (e: any) =>
            e.type === "PushEvent" &&
            new Date(e.created_at).getTime() > ninetyDaysAgo
        ).length
      : 0;

    const langMap: Record<string, number> = {};
    if (Array.isArray(repos)) {
      repos.forEach((repo: any) => {
        if (repo.language) {
          langMap[repo.language] = (langMap[repo.language] || 0) + 1;
        }
      });
    }

    const topLanguages = Object.entries(langMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([lang, count]) => ({ lang, count }));

    const totalStars = Array.isArray(repos)
      ? repos.reduce((acc: number, r: any) => acc + (r.stargazers_count || 0), 0)
      : 0;
    const totalForks = Array.isArray(repos)
      ? repos.reduce((acc: number, r: any) => acc + (r.forks_count || 0), 0)
      : 0;

    return NextResponse.json({
      username: user.login || username,
      name: user.name || user.login || username,
      avatar: user.avatar_url || `https://github.com/${username}.png`,
      bio: user.bio || "",
      followers: user.followers || 0,
      following: user.following || 0,
      publicRepos: user.public_repos ?? (Array.isArray(repos) ? repos.length : 0),
      totalStars,
      totalForks,
      recentPushes,
      topLanguages,
      createdAt: user.created_at,
      profileUrl: user.html_url || `https://github.com/${username}`,
    }, { headers: NO_CACHE_HEADERS });
  } catch (err) {
    console.error("GitHub stats fetch error:", err);
    return NextResponse.json(EMPTY_STATS, { headers: NO_CACHE_HEADERS });
  }
}

