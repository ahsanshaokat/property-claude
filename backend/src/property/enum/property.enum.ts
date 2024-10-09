export enum PropertyPurpose {
  RENT = 'RENT',
  SALE = 'SALE',
}

export enum Accommodation {
  WITHOUT_FURNITURE = 'Without furniture',
  WITHOUT_REPAIR = 'Without repair',
  WITH_DESIGNER_RENOVATION = 'With designer renovation',
  FURNISHED = 'Furnished',
  WITH_REPAIR = 'With repair',
  ROUGH_FINISH = 'Rough finish',
}

export enum Heating {
  CENTRAL_HEATING = 'Central Heating',
  DIRECT_HEATING = 'Direct Heating',
  FLOOR_HEATING = 'Floor Heating',
}

export enum ParkingZone {
  FREE_ZONE = 'Free Zone',
  PAID_ZONE = 'Paid Zone',
}

export enum AdditionalSpace {
  STORAGE_SPACE = 'Storage Space',
}

export enum PetAllowed {
  YES = 'Yes',
  NO = 'No',
}

export enum PaymentPeriod {
  WEEKLY = 'Weekly',
  MONTHLY = 'Monthly',
}

export enum ElectricityBill {
  BEFORE_SPENDING = 'Before Spending',
  AFTER_SPENDING = 'After Spending',
}

export enum Habitability {
  INSTANTLY = 'Instantly',
}

// private isStatusValid(status: keyof typeof TaskStatus) {
//     const value = TaskStatus[status];
//     return !!value;
//     TaskStatus[status]
//   }

// for (let value in Values) {
//   console.log(Values[value]);
// }
