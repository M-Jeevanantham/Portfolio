import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "username required" }, { status: 400 });
  }

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
      return NextResponse.json({ error: "GitHub user not found" }, { status: 404 });
    }

    const user = await userRes.json();
    const repos = reposRes.ok ? await reposRes.json() : [];
    const events = eventsRes.ok ? await eventsRes.json() : [];

    // Count contributions from events (push events in last 90 days)
    const now = Date.now();
    const ninetyDaysAgo = now - 90 * 24 * 60 * 60 * 1000;
    const recentPushes = events.filter(
      (e: any) =>
        e.type === "PushEvent" &&
        new Date(e.created_at).getTime() > ninetyDaysAgo
    ).length;

    // Language stats from repos
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
      username: user.login,
      name: user.name,
      avatar: user.avatar_url,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      publicRepos: user.public_repos,
      totalStars,
      totalForks,
      recentPushes,
      topLanguages,
      createdAt: user.created_at,
      profileUrl: user.html_url,
    });
  } catch (err) {
    console.error("GitHub stats error:", err);
    return NextResponse.json({ error: "Failed to fetch GitHub stats" }, { status: 500 });
  }
}
