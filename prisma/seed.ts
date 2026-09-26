import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/client/client";

const connectionString =
  process.env.DATABASE_URL ?? "postgresql://postgres:postgres@127.0.0.1:54322/postgres";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting database seed...");

  // 1. Clean existing records in reverse dependency order
  await prisma.eventAuditLog.deleteMany({});
  await prisma.contestant.deleteMany({});
  await prisma.event.deleteMany({});
  console.log("  ✓ Cleaned existing database records");

  const now = Date.now();
  const organizerId = "usr_organizer_mock_01";

  // 2. Scheduled Event (Starts in 3 days, ends in 7 days)
  const scheduledEvent = await prisma.event.create({
    data: {
      id: "evt_scheduled_01",
      slug: "miss-luzon-2026",
      title: "Miss Luzon 2026",
      description:
        "The premier cultural heritage, beauty, and youth advocacy pageant of Northern and Central Luzon. Support your candidate via authenticated digital voting.",
      bannerUrl:
        "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=80",
      startsAt: new Date(now + 1000 * 60 * 60 * 24 * 3), // +3 days
      endsAt: new Date(now + 1000 * 60 * 60 * 24 * 7), // +7 days
      publicationStatus: "PUBLISHED",
      showResultsOnClose: true,
      organizerId,
      contestants: {
        create: [
          {
            id: "cst_luzon_01",
            contestantNumber: 1,
            name: "Maria Angelica Santos",
            bio: "Advocate for marine conservation, sustainable coastal ecotourism, and youth literacy.",
            avatarUrl:
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
            voteCount: 0,
          },
          {
            id: "cst_luzon_02",
            contestantNumber: 2,
            name: "Bea Christine Ramos",
            bio: "Software engineering graduate championing STEM education for underprivileged young women.",
            avatarUrl:
              "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
            voteCount: 0,
          },
          {
            id: "cst_luzon_03",
            contestantNumber: 3,
            name: "Camille Joy Navarro",
            bio: "Heritage preservation advocate dedicated to indigenous textile weaving and community livelihoods.",
            avatarUrl:
              "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
            voteCount: 0,
          },
          {
            id: "cst_luzon_04",
            contestantNumber: 4,
            name: "Danica Rose Flores",
            bio: "Public health educator promoting preventive pediatric care and community mental wellness.",
            avatarUrl:
              "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80",
            voteCount: 0,
          },
        ],
      },
      auditLogs: {
        create: [
          {
            id: "log_luzon_01",
            action: "EVENT_PUBLISHED",
            changedBy: organizerId,
            previousVal: { publicationStatus: "DRAFT" },
            newVal: { publicationStatus: "PUBLISHED" },
            reason: "Final contestant lineup verified and officially published.",
          },
        ],
      },
    },
  });
  console.log(`  ✓ Seeded Scheduled Event: ${scheduledEvent.title} (${scheduledEvent.slug})`);

  // 3. Active Event (Started 1 day ago, ends in 2 days)
  const activeEvent = await prisma.event.create({
    data: {
      id: "evt_active_01",
      slug: "miss-visayas-2026",
      title: "Miss Visayas 2026",
      description:
        "Celebrating island heritage, tourism diplomacy, and grassroots community empowerment across the Western, Central, and Eastern Visayas regions.",
      bannerUrl:
        "https://images.unsplash.com/photo-1469488865564-c2de10f69f96?auto=format&fit=crop&w=1600&q=80",
      startsAt: new Date(now - 1000 * 60 * 60 * 24), // -1 day
      endsAt: new Date(now + 1000 * 60 * 60 * 48), // +2 days
      publicationStatus: "PUBLISHED",
      showResultsOnClose: true,
      organizerId,
      contestants: {
        create: [
          {
            id: "cst_visayas_01",
            contestantNumber: 1,
            name: "Hannah Patricia Gomez",
            bio: "Marine biologist pioneering coral reef restoration and community sea sanctuaries.",
            avatarUrl:
              "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
            voteCount: 1420,
          },
          {
            id: "cst_visayas_02",
            contestantNumber: 2,
            name: "Alyssa Marie Tan",
            bio: "Social entrepreneur supporting artisan weaving cooperatives and ethical fashion.",
            avatarUrl:
              "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80",
            voteCount: 1250,
          },
          {
            id: "cst_visayas_03",
            contestantNumber: 3,
            name: "Kathleen Sofia Reyes",
            bio: "Registered nurse advocating for accessible rural mobile clinic healthcare services.",
            avatarUrl:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
            voteCount: 1680,
          },
          {
            id: "cst_visayas_04",
            contestantNumber: 4,
            name: "Jasmine Clarisse Cruz",
            bio: "Environmental scientist campaigning for renewable energy transitions and clean waterways.",
            avatarUrl:
              "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
            voteCount: 980,
          },
        ],
      },
    },
  });
  console.log(`  ✓ Seeded Active Event: ${activeEvent.title} (${activeEvent.slug})`);

  // 4. Closed Event (Started 3 days ago, ended 2 hours ago)
  const closedEvent = await prisma.event.create({
    data: {
      id: "evt_closed_01",
      slug: "miss-mindanao-2026",
      title: "Miss Mindanao 2026",
      description:
        "The coronation celebrating Mindanao's rich cultural diversity, agricultural innovation, and youth peace-building leadership.",
      bannerUrl:
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=80",
      startsAt: new Date(now - 1000 * 60 * 60 * 72), // -3 days
      endsAt: new Date(now - 1000 * 60 * 60 * 2), // -2 hours
      publicationStatus: "PUBLISHED",
      showResultsOnClose: true,
      organizerId,
      contestants: {
        create: [
          {
            id: "cst_mindanao_01",
            contestantNumber: 1,
            name: "Samira Nur Alonto",
            bio: "Cultural anthropologist and peace advocate fostering interfaith community dialogue.",
            avatarUrl:
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
            voteCount: 5765,
          },
          {
            id: "cst_mindanao_02",
            contestantNumber: 2,
            name: "Trisha Mae Villanueva",
            bio: "Agricultural scientist researching climate-resilient organic rice farming practices.",
            avatarUrl:
              "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
            voteCount: 4345,
          },
          {
            id: "cst_mindanao_03",
            contestantNumber: 3,
            name: "Chloe Dominique Yap",
            bio: "E-commerce founder helping indigenous craftsmen distribute products internationally.",
            avatarUrl:
              "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80",
            voteCount: 2925,
          },
          {
            id: "cst_mindanao_04",
            contestantNumber: 4,
            name: "Patricia Faith Lim",
            bio: "Youth educator championing solar-powered mobile classrooms for remote mountain schools.",
            avatarUrl:
              "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
            voteCount: 1505,
          },
        ],
      },
    },
  });
  console.log(`  ✓ Seeded Closed Event: ${closedEvent.title} (${closedEvent.slug})`);

  // 5. Draft Event (Internal Organizer Preview)
  const draftEvent = await prisma.event.create({
    data: {
      id: "evt_draft_01",
      slug: "preview-draft-contest",
      title: "Miss Global Philippines 2026 (Internal Preview)",
      description:
        "Draft staging instance for pre-launch sponsor review and credentialed judge candidate evaluations.",
      bannerUrl:
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1600&q=80",
      startsAt: new Date(now + 1000 * 60 * 60 * 24 * 10),
      endsAt: new Date(now + 1000 * 60 * 60 * 24 * 14),
      publicationStatus: "DRAFT",
      draftPassphraseHash: "electa2026",
      showResultsOnClose: false,
      organizerId,
      contestants: {
        create: [
          {
            id: "cst_draft_01",
            contestantNumber: 1,
            name: "Candidate One (Preview)",
            bio: "Preview profile bio for initial review.",
            avatarUrl:
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
            voteCount: 0,
          },
          {
            id: "cst_draft_02",
            contestantNumber: 2,
            name: "Candidate Two (Preview)",
            bio: "Preview profile bio for initial review.",
            avatarUrl:
              "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
            voteCount: 0,
          },
        ],
      },
    },
  });
  console.log(`  ✓ Seeded Draft Event: ${draftEvent.title} (${draftEvent.slug})`);

  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
