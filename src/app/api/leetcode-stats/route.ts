import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
};

const LEETCODE_API = "https://leetcode.com/graphql";

const LEETCODE_QUERY = `
query userPublicProfile($username: String!) {
  matchedUser(username: $username) {
    username
    profile {
      realName
      starRating
      ranking
      reputation
    }
    submitStats: submitStatsGlobal {
      acSubmissionNum {
        difficulty
        count
        submissions
      }
    }
    userCalendar {
      activeYears
      streak
      totalActiveDays
      submissionCalendar
    }
  }
}
`;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username") || "Jeeva_sadi";

  const EMPTY_STATS = {
    username: username,
    ranking: 0,
    reputation: 0,
    totalSolved: 0,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    streak: 0,
    totalActiveDays: 0,
    activeYears: [],
    profileUrl: `https://leetcode.com/${username}`,
  };

  try {
    const res = await fetch(LEETCODE_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: "https://leetcode.com",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      body: JSON.stringify({
        query: LEETCODE_QUERY,
        variables: { username },
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(EMPTY_STATS, { headers: NO_CACHE_HEADERS });
    }

    const data = await res.json();
    const user = data?.data?.matchedUser;

    if (!user) {
      // Try secondary public API endpoint if GraphQL fails
      try {
        const altRes = await fetch(`https://alfa-leetcode-api.onrender.com/userProfile/${username}`, { cache: "no-store" });
        if (altRes.ok) {
          const altData = await altRes.json();
          if (altData && !altData.errors) {
            return NextResponse.json({
              username: altData.username || username,
              ranking: altData.ranking || 0,
              reputation: altData.reputation || 0,
              totalSolved: altData.totalSolved || 0,
              easySolved: altData.easySolved || 0,
              mediumSolved: altData.mediumSolved || 0,
              hardSolved: altData.hardSolved || 0,
              streak: 0,
              totalActiveDays: 0,
              activeYears: [],
              profileUrl: `https://leetcode.com/${username}`,
            }, { headers: NO_CACHE_HEADERS });
          }
        }
      } catch (e) {
        // Ignore fallback error
      }
      return NextResponse.json(EMPTY_STATS, { headers: NO_CACHE_HEADERS });
    }

    const stats = user.submitStats?.acSubmissionNum || [];
    const totalSolved = stats.find((s: any) => s.difficulty === "All")?.count || 0;
    const easySolved = stats.find((s: any) => s.difficulty === "Easy")?.count || 0;
    const mediumSolved = stats.find((s: any) => s.difficulty === "Medium")?.count || 0;
    const hardSolved = stats.find((s: any) => s.difficulty === "Hard")?.count || 0;

    const calendar = user.userCalendar;

    return NextResponse.json({
      username: user.username || username,
      ranking: user.profile?.ranking || 0,
      reputation: user.profile?.reputation || 0,
      totalSolved,
      easySolved,
      mediumSolved,
      hardSolved,
      streak: calendar?.streak || 0,
      totalActiveDays: calendar?.totalActiveDays || 0,
      activeYears: calendar?.activeYears || [],
      profileUrl: `https://leetcode.com/${username}`,
    }, { headers: NO_CACHE_HEADERS });
  } catch (err) {
    console.error("LeetCode stats fetch error:", err);
    return NextResponse.json(EMPTY_STATS, { headers: NO_CACHE_HEADERS });
  }
}

