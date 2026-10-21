export interface CustomerTestimonial {
  id: string;
  quote: string;
  /** Use initials or a non-identifying label; do not add a full name. */
  displayName: string;
  perfumeLabel: string;
  /** Only set true after the customer explicitly agrees to publish this quote. */
  consentConfirmed: true;
}

/**
 * Add only verbatim customer feedback received from a real customer, after consent to publish.
 * Keep the list empty until those reviews and permissions exist. The homepage requires 3 reviews
 * before showing social-proof cards and will show no more than 5 at a time.
 */
export const APPROVED_TESTIMONIALS: CustomerTestimonial[] = [];
