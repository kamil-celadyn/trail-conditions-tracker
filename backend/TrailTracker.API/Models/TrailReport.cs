namespace TrailTracker.API.Models
{
    public class TrailReport
    {
        public int Id { get; set; }
        public string TrailName { get; set; } = string.Empty;
        public double Latitude { get; set; } // Zamiast PostGIS, proste współrzędne
        public double Longitude { get; set; }
        public string Condition { get; set; } = string.Empty; // np. "Błoto", "Oblodzenie", "Zaspy"
        public string Description { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsVerified { get; set; } = false; // Administrator w panelu będzie mógł to zmienić
    }
}