import "@typespec/http";
import "@typespec/openapi";

using TypeSpec.Http;
using TypeSpec.OpenAPI;

@service(#{
  title: "Booking API",
})
@server("https://api.example.com", "Production server")
namespace BookingAPI;

model Owner {
  id: string;
  name: string;
  title: string;
  timezone: string;
}

model EventType {
  id: string;
  title: string;
  description: string;
  durationMinutes: int32;
}

model CreateEventTypeInput {
  title: string;
  description: string;
  durationMinutes: int32;
}

model Slot {
  startAt: utcDateTime;
  endAt: utcDateTime;
  available: boolean;
  bookingId?: string;
}

model Booking {
  id: string;
  eventTypeId: string;
  guestName: string;
  guestEmail: string;
  guestNotes?: string;
  startAt: utcDateTime;
  endAt: utcDateTime;
  createdAt: utcDateTime;
}

model ErrorResponse {
  code: string;
  message: string;
  details?: string;
}

@error
model BadRequestError extends ErrorResponse {
  code: "BAD_REQUEST";
}

@error
model NotFoundError extends ErrorResponse {
  code: "NOT_FOUND";
}

@error
model ConflictError extends ErrorResponse {
  code: "CONFLICT";
}

alias DefaultResponses = BadRequestError | NotFoundError | ConflictError;

@route("/owner")
interface OwnerOperations {
  @get
  getOwner(): {
    @statusCode statusCode: 200;
    @body owner: Owner;
  };
}

@route("/event-types")
interface EventTypeOperations {
  @get
  listEventTypes(): {
    @statusCode statusCode: 200;
    @body eventTypes: EventType[];
  };

  @post
  createEventType(
    @body eventType: CreateEventTypeInput
  ): {
    @statusCode statusCode: 201;
    @body eventType: EventType;
  } | {
    @statusCode statusCode: 400;
    @body error: BadRequestError;
  };
}

@route("/event-types/{eventTypeId}")
interface EventTypeItemOperations {
  @get
  getEventType(
    @path eventTypeId: string
  ): {
    @statusCode statusCode: 200;
    @body eventType: EventType;
  } | {
    @statusCode statusCode: 404;
    @body error: NotFoundError;
  };
}

@route("/event-types/{eventTypeId}/slots")
interface SlotOperations {
  @get
  listSlots(
    @path eventTypeId: string,
    @query from: utcDateTime,
    @query to: utcDateTime
  ): {
    @statusCode statusCode: 200;
    @body slots: Slot[];
  } | {
    @statusCode statusCode: 400;
    @body error: BadRequestError;
  } | {
    @statusCode statusCode: 404;
    @body error: NotFoundError;
  };
}

@route("/bookings")
interface BookingGuestOperations {
  @post
  createBooking(@body booking: {
    eventTypeId: string;
    guestName: string;
    guestEmail: string;
    guestNotes?: string;
    slotStartAt: utcDateTime;
  }): {
    @statusCode statusCode: 201;
    @body booking: Booking;
  } | {
    @statusCode statusCode: 400;
    @body error: BadRequestError;
  } | {
    @statusCode statusCode: 404;
    @body error: NotFoundError;
  } | {
    @statusCode statusCode: 409;
    @body error: ConflictError;
  };
}

@route("/bookings/upcoming")
interface BookingOwnerOperations {
  @get
  listUpcomingBookings(): {
    @statusCode statusCode: 200;
    @body bookings: Booking[];
  };
}
