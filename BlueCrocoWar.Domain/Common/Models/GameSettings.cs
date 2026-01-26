namespace BlueCrocoWar.Domain.Common.Models
{
    public class GameSettings
    {
        // Set to 0 for unlimited
        public int MaxRounds { get; set; } = 0;
        public int CardRevealDelayMs { get; set; } = 2000;
        public int TimebankSeconds { get; set; } = 300;
    }
}
