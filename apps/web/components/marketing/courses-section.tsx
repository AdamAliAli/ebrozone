import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { SectionHeader } from "../ui/section-header";

// docs/SITEMAP.md "Courses" + docs/product/HOMEPAGE_STORYBOARD.md Section 6
// — these four course names are the only ones documented anywhere in the
// project; no pricing, duration, or enrollment numbers are documented, so
// none are shown here.
const COURSES = [
  {
    title: "Master Conversation",
    description:
      "Build fluency and confidence through natural, real-life conversations.",
  },
  {
    title: "IELTS Preparation",
    description:
      "Prepare for your IELTS exam with focused, personalized guidance.",
  },
  {
    title: "Academic English",
    description:
      "Strengthen the English skills you need for university and academic success.",
  },
  {
    title: "Slang & Everyday English",
    description: "Learn the casual, everyday English that textbooks don't teach.",
  },
];

export function CoursesSection() {
  return (
    <section id="courses" className="bg-muted/40 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <SectionHeader
          title="Courses"
          description="Learning paths available inside EbroZone."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {COURSES.map((course) => (
            <Card key={course.title}>
              <CardHeader>
                <CardTitle className="text-card-title">{course.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-body text-muted-foreground">
                  {course.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
