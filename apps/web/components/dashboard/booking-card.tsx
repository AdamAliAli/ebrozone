import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { BookingResponse } from "../../lib/api/types";

const TYPE_LABEL: Record<BookingResponse["type"], string> = {
  LIVE_CLASS: "Live Class",
  FREE_CONSULTATION: "Free Consultation",
};

function formatScheduledAt(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
    }),
    time: d.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    }),
  };
}

// Bound to BookingResponse — reusable wherever a booking needs to be
// displayed (Student's Next Lesson, and later Teacher's Today's
// Lessons / Admin's Today's Classes, since all three consume the same
// backend DTO).
export function BookingCard({ booking }: { booking: BookingResponse }) {
  const { date, time } = formatScheduledAt(booking.scheduledAt);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-card-title">
            {TYPE_LABEL[booking.type]}
          </CardTitle>
          <Badge variant="secondary">{booking.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="text-body text-foreground">
          <p className="font-medium">{date}</p>
          <p className="text-muted-foreground">{time}</p>
        </div>
        {booking.meetingLink ? (
          <Button asChild>
            <a href={booking.meetingLink} target="_blank" rel="noreferrer">
              Join Lesson
            </a>
          </Button>
        ) : (
          <p className="text-small text-muted-foreground">
            The meeting link will appear here once your teacher adds it.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
