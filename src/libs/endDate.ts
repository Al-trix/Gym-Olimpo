import { SubscriptionType } from '@prisma/client';

const endDate = (type: SubscriptionType) => {
  const startDate: Date = new Date();
  const msPerDay: number = 24 * 60 * 60 * 1000;
  let endSubscription: Date;

  
  if (type === SubscriptionType.DAY) {
    endSubscription = new Date(startDate.getTime() + msPerDay);
  } else if (type === SubscriptionType.FORTNIGHT) {
    endSubscription = new Date(startDate.getTime() + 15 * msPerDay);
  } else if (type === SubscriptionType.MONTH) {
    endSubscription = new Date(startDate.getTime() + 30 * msPerDay);
  } else if (type === SubscriptionType.YEAR) {
    endSubscription = new Date(startDate.getTime() + 365 * msPerDay);
  }else{
    endSubscription = new Date(startDate.getTime() + 30 * msPerDay);
  }

  return {
    start: startDate,
    end: endSubscription,
  };
};

export default endDate;