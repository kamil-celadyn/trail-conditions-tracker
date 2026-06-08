using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using TrailTracker.API.Models;

namespace TrailTracker.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<TrailReport> TrailReports { get; set; }
        public DbSet<User> Users { get; set; }
    }
}