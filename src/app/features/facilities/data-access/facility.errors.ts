export class FacilityNotFoundError extends Error {
  constructor(public readonly facilityId: string) {
    super(`No facility exists with id ${facilityId}`);
    this.name = 'FacilityNotFoundError';
  }
}

export class FacilityRequestFailedError extends Error {
  constructor() {
    super('The facility service did not respond');
    this.name = 'FacilityRequestFailedError';
  }
}
