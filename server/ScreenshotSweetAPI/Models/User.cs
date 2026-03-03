namespace ScreenshotStudio.Models
{
    public enum SubscriptionType
    {
        Free,
        WeekendWarrior,
        Monthly,
        Yearly
    }
    public class User
    {
        public int Id {get; set;}
        public string Email{get; set;}

        public string? Name{get; set;}

        //public bool IsSubscriber{get; set;}

        public SubscriptionType SubType{get; set;}

        public DateTime SignUpDate{get; set;}

        public DateTimeOffset? SubscriptionStartDate{get; set;}
        public DateTimeOffset? SubscriptionEndDate{get; set;}

        public DateTimeOffset? LastLogin{get; set;}

        //Hashed Password, start with google OAuth, then add this
        //StripeCustomerId
        //UserProjects
        
    }
}