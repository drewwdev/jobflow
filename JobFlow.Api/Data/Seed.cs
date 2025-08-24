using JobFlow.Api.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace JobFlow.Api.Data;

public static class Seed
{
    public static async Task EnsureSeededAsync(AppDbContext db)
    {
        if (await db.Applications.AnyAsync()) return;

        var acme = new Company { Name = "Acme Corp", Website = "https://acme.example" };
        var globex = new Company { Name = "Globex",    Website = "https://globex.example" };
        var initech = new Company { Name = "Initech",  Website = "https://initech.example" };

        db.Companies.AddRange(acme, globex, initech);
        await db.SaveChangesAsync();

        var app1 = new Application {
            Title = "Junior Full Stack Developer",
            CompanyId = acme.Id,
            Location = "Remote",
            SourceUrl = "https://jobs.example.com/acme/jr-fullstack",
            Status = AppStatus.Applied,
            AppliedAt = DateTime.UtcNow.AddDays(-5)
        };

        var app2 = new Application {
            Title = "Frontend Developer (React)",
            CompanyId = globex.Id,
            Location = "Atlanta, GA",
            SourceUrl = "https://jobs.example.com/globex/fe-react",
            Status = AppStatus.PhoneScreen,
            AppliedAt = DateTime.UtcNow.AddDays(-10),
            InterviewAt = DateTime.UtcNow.AddDays(-2)
        };

        var app3 = new Application {
            Title = "Backend Developer (.NET)",
            CompanyId = initech.Id,
            Location = "Tampa, FL",
            SourceUrl = "https://jobs.example.com/initech/dotnet",
            Status = AppStatus.Saved
        };

        var app4 = new Application {
            Title = "Full Stack Developer (TS/.NET)",
            CompanyId = acme.Id,
            Location = "Remote",
            SourceUrl = "https://jobs.example.com/acme/fs-ts-dotnet",
            Status = AppStatus.Interview,
            AppliedAt = DateTime.UtcNow.AddDays(-20),
            InterviewAt = DateTime.UtcNow.AddDays(-1)
        };

        db.Applications.AddRange(app1, app2, app3, app4);
        await db.SaveChangesAsync();

        db.Activities.AddRange(
            new Activity { ApplicationId = app1.Id, Type = "Note", Body = "Submitted application via company site", OccurredAt = app1.AppliedAt ?? DateTime.UtcNow },
            new Activity { ApplicationId = app1.Id, Type = "Note", Body = "Sent follow-up email to recruiter", OccurredAt = DateTime.UtcNow.AddDays(-3) },

            new Activity { ApplicationId = app2.Id, Type = "Call", Body = "Phone screen with HR", OccurredAt = DateTime.UtcNow.AddDays(-2) },
            new Activity { ApplicationId = app2.Id, Type = "Note", Body = "They use React + .NET; next step is tech interview", OccurredAt = DateTime.UtcNow.AddDays(-1) },

            new Activity { ApplicationId = app4.Id, Type = "Interview", Body = "Technical interview (pairing) went well", OccurredAt = DateTime.UtcNow.AddHours(-22) }
        );

        await db.SaveChangesAsync();
    }
}
