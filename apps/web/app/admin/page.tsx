import type { Metadata } from "next";
import { serverFetch } from "../../lib/api/server-fetch";
import type { AdminDashboardResponse } from "../../lib/api/types";
import { SectionHeader } from "../../components/ui/section-header";
import { BookingCard } from "../../components/dashboard/booking-card";
import { ConsultationRequestListItem } from "../../components/dashboard/consultation-request-list-item";
import { StatCard } from "../../components/ui/stat-card";
import { Card, CardContent } from "../../components/ui/card";

export const metadata: Metadata = {
  title: "Dashboard | EbroZone",
};

export default async function AdminDashboardPage() {
  const data = await serverFetch<AdminDashboardResponse>("/dashboard/admin");

  return (
    <div className="flex flex-col gap-8">
      <section>
        {/* docs/product-design/admin-dashboard: greeting doesn't require a
            name specifically, but no name field exists on User anywhere in
            the backend regardless — intentionally generic. */}
        <h1 className="text-page font-bold text-foreground">Welcome back!</h1>
        <p className="mt-1 text-body-lg text-muted-foreground">
          Here&apos;s your platform overview for today.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <StatCard label="Total Students" value={data.totalStudents} />
          <StatCard label="Active Students" value={data.activeStudents} />
          <StatCard label="Today's Classes" value={data.todaysClasses.length} />
          <StatCard
            label="Today's Consultations"
            value={data.todaysConsultations.length}
          />
          <StatCard label="Unread Messages" value={data.unreadMessagesCount} />
        </div>
      </section>

      <section>
        <SectionHeader title="New Consultation Requests" />
        <div className="mt-4">
          {data.newConsultationRequests.length > 0 ? (
            <Card>
              <CardContent>
                <ul>
                  {data.newConsultationRequests.map((request) => (
                    <ConsultationRequestListItem
                      key={request.id}
                      request={request}
                    />
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-body text-muted-foreground">
                No new consultation requests.
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <section>
        <SectionHeader title="Today's Classes" />
        <div className="mt-4">
          {data.todaysClasses.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.todaysClasses.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-body text-muted-foreground">
                No classes scheduled for today.
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <section>
        <SectionHeader title="Today's Consultations" />
        <div className="mt-4">
          {data.todaysConsultations.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.todaysConsultations.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-body text-muted-foreground">
                No consultations scheduled for today.
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <section>
        <SectionHeader title="Recent Bookings" />
        <div className="mt-4">
          {data.recentBookings.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.recentBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-body text-muted-foreground">
                No recent bookings.
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
