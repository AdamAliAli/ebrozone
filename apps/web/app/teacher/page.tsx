import type { Metadata } from "next";
import { serverFetch } from "../../lib/api/server-fetch";
import type { TeacherDashboardResponse } from "../../lib/api/types";
import { SectionHeader } from "../../components/ui/section-header";
import { BookingCard } from "../../components/dashboard/booking-card";
import { HomeworkListItem } from "../../components/dashboard/homework-list-item";
import { MessagePreview } from "../../components/dashboard/message-preview";
import { StatCard } from "../../components/ui/stat-card";
import { Card, CardContent } from "../../components/ui/card";

export const metadata: Metadata = {
  title: "Dashboard | EbroZone",
};

export default async function TeacherDashboardPage() {
  const data = await serverFetch<TeacherDashboardResponse>(
    "/dashboard/teacher",
  );

  return (
    <div className="flex flex-col gap-8">
      <section>
        {/* docs/product-design/teacher-dashboard: greeting doesn't require
            a name specifically, but no name field exists on User anywhere
            in the backend regardless — intentionally generic. */}
        <h1 className="text-page font-bold text-foreground">Welcome back!</h1>
        <p className="mt-1 text-body-lg text-muted-foreground">
          Here&apos;s your teaching overview for today.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <StatCard
            label="Lessons Today"
            value={data.todaysSchedule.length}
          />
          <StatCard
            label="Assignments to Review"
            value={data.homeworkAwaitingReview.length}
          />
        </div>
      </section>

      <section>
        <SectionHeader title="Today's Lessons" />
        <div className="mt-4">
          {data.todaysSchedule.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.todaysSchedule.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-body text-muted-foreground">
                You don&apos;t have any lessons scheduled today.
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <section>
        <SectionHeader title="Assignments to Review" />
        <div className="mt-4">
          {data.homeworkAwaitingReview.length > 0 ? (
            <Card>
              <CardContent>
                <ul>
                  {data.homeworkAwaitingReview.map((item) => (
                    <HomeworkListItem key={item.id} homework={item} />
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-body text-muted-foreground">
                No assignments are waiting for review.
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <section>
        <SectionHeader title="Recent Messages" />
        <div className="mt-4">
          {data.recentStudentMessages.length > 0 ? (
            <Card>
              <CardContent>
                <ul>
                  {data.recentStudentMessages.map((message) => (
                    <MessagePreview key={message.id} message={message} />
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-body text-muted-foreground">
                No messages yet.
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
