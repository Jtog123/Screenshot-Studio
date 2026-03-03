namespace ScreenshotStudio.Models
{
    public enum SubscriptionType
    {
        Free,
        TwoDay,
        Monthly,
        Yearly
    }
    public class User
    {
        public int Id {get; set;}
        public string Email{get; set;}

        public string Name{get; set;}

        public bool IsSubscriber{get; set;}

        public SubscriptionType SubType{get; set;}
    }
}