import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
    badges {
      id
      displayName
      icon
    }
    activeBadge {
      displayName
      icon
    }
    userCalendar {
      activeYears
      streak
      totalActiveDays
      dccBadges {
        timestamp
        badge { name icon }
      }
      submissionCalendar
    }
  }
}
`;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "username required" }, { status: 400 });
  }

  try {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    const res = await fetch(LEETCODE_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: "https://leetcode.com",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      body: JSON.stringify({
        query: LEETCODE_QUERY,
        variables: { username },
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: "LeetCode API error" }, { status: 502 });
    }

    const data = await res.json();
    const user = data?.data?.matchedUser;

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const stats = user.submitStats?.acSubmissionNum || [];
    const totalSolved = stats.find((s: any) => s.difficulty === "All")?.count || 0;
    const easySolved = stats.find((s: any) => s.difficulty === "Easy")?.count || 0;
    const mediumSolved = stats.find((s: any) => s.difficulty === "Medium")?.count || 0;
    const hardSolved = stats.find((s: any) => s.difficulty === "Hard")?.count || 0;

    const calendar = user.userCalendar;
    const submissionCalendar = calendar?.submissionCalendar
      ? JSON.parse(calendar.submissionCalendar)
      : {};

    // Count active days in last 365 days
    const yearAgo = Math.floor(Date.now() / 1000) - 365 * 24 * 60 * 60;
    const activeDaysThisYear = Object.entries(submissionCalendar).filter(
      ([ts]) => parseInt(ts) > yearAgo
    ).length;

    return NextResponse.json({
      username: user.username,
      ranking: user.profile?.ranking,
      reputation: user.profile?.reputation,
      totalSolved,
      easySolved,
      mediumSolved,
      hardSolved,
      streak: calendar?.streak || 0,
      totalActiveDays: calendar?.totalActiveDays || 0,
      activeDaysThisYear,
      activeYears: calendar?.activeYears || [],
      badges: (user.badges || []).slice(0, 6),
      activeBadge: user.activeBadge,
      profileUrl: `https://leetcode.com/${username}`,
    });
  } catch (err) {
    console.error("LeetCode stats error:", err);
    return NextResponse.json({ error: "Failed to fetch LeetCode stats" }, { status: 500 });
  }
}
