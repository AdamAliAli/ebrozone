import type { Metadata } from "next";
import { serverFetch } from "../../lib/api/server-fetch";
import type { StudentDashboardResponse } from "../../lib/api/types";
import { SectionHeader } from "../../components/ui/section-header";
import { BookingCard } from "../../components/dashboard/booking-card";
import { HomeworkListItem } from "../../components/dashboard/homework-list-item";
import { StatCard } from "../../components/ui/stat-card";
import { ProgressBar } from "../../components/ui/progress-bar";
import { Card, CardContent } from "../../components/ui/card";

export const metadata: Metadata = {
  title: "Dashboard | EbroZone",
};

export default async function StudentDashboardPage() {
  const data = await serverFetch<StudentDashboardResponse>(
    "/dashboard/student",
  );

  const totalHomework =
    data.homework.notSubmittedCount +
    data.homework.submittedCount +
    data.homework.reviewedCount;

  return (
    <div className="flex flex-col gap-8">
      <section>
        {/* docs/product-design/student-dashboard: greeting uses the
            student's name — no name field exists on User anywhere in the
            backend, so this is intentionally generic, not a placeholder. */}
        <h1 className="text-page font-bold text-foreground">Welcome back!</h1>
        <p className="mt-1 text-body-lg text-muted-foreground">
          Here&apos;s what&apos;s happening with your learning today.
        </p>
      </section>

      <section>
        <SectionHeader title="Next Lesson" />
        <div className="mt-4">
          {data.nextLiveClass ? (
            <BookingCard booking={data.nextLiveClass} />
          ) : (
            <Card>
              <CardContent className="text-body text-muted-foreground">
                You don&apos;t have an upcoming live class scheduled yet.
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <section>
        <SectionHeader
          title="Homework"
          description={`${data.homework.notSubmittedCount} not submitted`}
        />
        <div className="mt-4">
          {data.homework.items.length > 0 ? (
            <Card>
              <CardContent>
                <ul>
                  {data.homework.items.map((item) => (
                    <HomeworkListItem key={item.id} homework={item} />
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-body text-muted-foreground">
                No homework has been assigned yet.
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <section>
        <SectionHeader title="Progress" />
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <StatCard
            label="Completed Lessons"
            value={data.progress.completedLessons}
          />
          <Card className="py-4">
            <CardContent className="px-4">
              {totalHomework > 0 ? (
                <ProgressBar
                  label="Homework Completed"
                  value={data.progress.homeworkCompleted}
                  max={totalHomework}
                />
              ) : (
                <p className="text-small text-muted-foreground">
                  No homework yet to track progress on.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
