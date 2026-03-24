export enum SubscriptionType {
    Free = "Free",
    WeekendWarrior = "Weekend",
    Monthly = "Monthly"
}

export type AppUser = {
    user_id? : number
    google_id: string,
    display_name :string,
    email :string
    profile_picture: string,
    subscription_type : SubscriptionType,
    export_count? : number
}