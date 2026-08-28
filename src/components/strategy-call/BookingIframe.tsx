"use client";

import { useAttributedIframeSrc } from "./useAttributedIframeSrc";

const BOOKING_ID = "YeI4ZUC2SwV8MXDRKfzr";
const BOOKING_SRC = `https://api.leadconnectorhq.com/widget/booking/${BOOKING_ID}`;

/**
 * GHL booking-calendar embed with the Meta click ids (_fbc/_fbp) appended, so
 * GHL captures them on the booked contact and echoes them back to our CAPI
 * webhook. Client component because the ids live in cookies/sessionStorage.
 */
export default function BookingIframe() {
  const src = useAttributedIframeSrc(BOOKING_SRC);

  return (
    <iframe
      src={src}
      id={`${BOOKING_ID}_1781719379172`}
      style={{ width: "100%", border: "none", overflow: "hidden" }}
      scrolling="no"
      aria-label="Book Your Strategy Call"
    />
  );
}
