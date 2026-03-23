export interface SubscriptionLike {
  subscription_tier: string;
  subscription_end_date: string | null;
}

export function hasActiveProSubscription(profile: SubscriptionLike | null | undefined): boolean {
  if (!profile || profile.subscription_tier !== "pro" || !profile.subscription_end_date) {
    return false;
  }

  return new Date(profile.subscription_end_date).getTime() > Date.now();
}
