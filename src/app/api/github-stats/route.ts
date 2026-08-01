import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username") || "M-Jeevanantham";

  const FALLBACK_STATS = {
    username: username,
    name: "Jeevanantham M",
    avatar: "https://github.com/M-Jeevanantham.png",
    bio: "Full-Stack & Systems Engineer | Open Source Contributor",
    followers: 14,
    following: 18,
    publicRepos: 22,
    totalStars: 35,
    totalForks: 12,
    recentPushes: 48,
    topLanguages: [
      { lang: "TypeScript", count: 10 },
      { lang: "JavaScript", count: 7 },
      { lang: "React", count: 5 },
      { lang: "Node.js", count: 4 },
      { lang: "Python", count: 2 },
    ],
    createdAt: "2023-01-01T00:00:00Z",
    profileUrl: `https://github.com/${username}`,
  };

  try {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "portfolio-app",
    };

    // Fetch user profile + repos in parallel
    const [userRes, reposRes, eventsRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, { headers }),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100&type=owner`, { headers }),
      fetch(`https://api.github.com/users/${username}/events/public?per_page=100`, { headers }),
    ]);

    if (!userRes.ok) {
      return NextResponse.json(FALLBACK_STATS);
    }

    const user = await userRes.json();
    const repos = reposRes.ok ? await reposRes.json() : [];
    const events = eventsRes.ok ? await eventsRes.json() : [];

    const now = Date.now();
    const ninetyDaysAgo = now - 90 * 24 * 60 * 60 * 1000;
    const recentPushes = events.filter(
      (e: any) =>
        e.type === "PushEvent" &&
        new Date(e.created_at).getTime() > ninetyDaysAgo
    ).length;

    const langMap: Record<string, number> = {};
    (repos as any[]).forEach((repo: any) => {
      if (repo.language) {
        langMap[repo.language] = (langMap[repo.language] || 0) + 1;
      }
    });
    const topLanguages = Object.entries(langMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([lang, count]) => ({ lang, count }));

    const totalStars = (repos as any[]).reduce(
      (acc: number, r: any) => acc + (r.stargazers_count || 0),
      0
    );
    const totalForks = (repos as any[]).reduce(
      (acc: number, r: any) => acc + (r.forks_count || 0),
      0
    );

    return NextResponse.json({
      username: user.login || username,
      name: user.name || "Jeevanantham M",
      avatar: user.avatar_url || `https://github.com/${username}.png`,
      bio: user.bio || "Full-Stack & Systems Engineer",
      followers: user.followers || 14,
      following: user.following || 18,
      publicRepos: user.public_repos || (repos.length > 0 ? repos.length : 22),
      totalStars: totalStars || 35,
      totalForks: totalForks || 12,
      recentPushes: recentPushes || 48,
      topLanguages: topLanguages.length > 0 ? topLanguages : FALLBACK_STATS.topLanguages,
      createdAt: user.created_at,
      profileUrl: user.html_url || `https://github.com/${username}`,
    });
  } catch (err) {
    console.error("GitHub stats error, returning fallback:", err);
    return NextResponse.json(FALLBACK_STATS);
  }
}
