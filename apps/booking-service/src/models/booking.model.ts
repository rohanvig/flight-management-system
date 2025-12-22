// import { Schema, model, Document } from "mongoose";
import type { Passenger, Contact, FlightLeg } from "../types/index.js";
import sequelize from "../config/db.js";
import { DataTypes, Model, Optional } from "sequelize";

export interface BookingAttributes {
  id: string;
  bookingReference: string;
  userId?: string;
  status: "pending" | "confirmed" | "cancelled" | "failed";

  outbound: FlightLeg;
  return?: FlightLeg;

  passengers: Passenger[];
  contact: Contact;
  emergencyContact?: Contact;

  price: {
    base: number;
    taxes: number;
    extras: number;
    total: number;
    currency: string;
  };

  selectedSeats?: Record<string, string>;
  paymentIntentId?: string;
  bookedAt: Date;
  expiresAt: Date;
}

export type BookingCreationAttributes = Optional<
  BookingAttributes,
  | "id"
  | "userId"
  | "status"
  | "return"
  | "emergencyContact"
  | "selectedSeats"
  | "paymentIntentId"
  | "bookedAt"
  | "expiresAt"
>;

export class Booking
  extends Model<BookingAttributes, BookingCreationAttributes>
  implements BookingAttributes
{
  declare id: string;
  declare bookingReference: string;
  declare userId?: string;
  declare status: "pending" | "confirmed" | "cancelled" | "failed";

  declare outbound: FlightLeg;
  declare return?: FlightLeg;

  declare passengers: Passenger[];
  declare contact: Contact;
  declare emergencyContact?: Contact;

  declare price: {
    base: number;
    taxes: number;
    extras: number;
    total: number;
    currency: string;
  };

  declare selectedSeats?: Record<string, string>;
  declare paymentIntentId?: string;
  declare bookedAt: Date;
  declare expiresAt: Date;
}

Booking.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    bookingReference: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },

    userId: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM("pending", "confirmed", "cancelled", "failed"),
      defaultValue: "pending",
    },

    outbound: {
      type: DataTypes.JSONB,
      allowNull: false,
    },

    return: {
      type: DataTypes.JSONB,
      allowNull: true,
    },

    passengers: {
      type: DataTypes.ARRAY(DataTypes.JSONB),
      allowNull: false,
    },

    contact: {
      type: DataTypes.JSONB,
      allowNull: false,
    },

    emergencyContact: {
      type: DataTypes.JSONB,
      allowNull: true,
    },

    price: {
      type: DataTypes.JSONB,
      allowNull: false,
    },

    selectedSeats: {
      type: DataTypes.JSONB,
      allowNull: true,
    },

    paymentIntentId: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    bookedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    expiresAt: {
      type: DataTypes.DATE,
      defaultValue: () => new Date(Date.now() + 30 * 60 * 1000),
    },
  },
  {
    sequelize,
    tableName: "bookings",
    timestamps: true,

    hooks: {
      beforeValidate: (booking) => {
        if (!booking.bookingReference) {
          booking.bookingReference =
            "TPM" + Math.random().toString(36).substring(2, 8).toUpperCase();
        }
      },
    },
  }
);

// MongoDB schema definition (currently commented out)
// const bookingSchema = new Schema<IBooking>({
//   bookingReference: { type: String, unique: true },
//   userId: { type: Schema.Types.ObjectId, ref: "User" },
//   status: {
//     type: String,
//     enum: ["pending", "confirmed", "cancelled", "failed"],
//     default: "pending"
//   },

//   outbound: { type: Object, required: true },
//   return: Object,

//   passengers: [{ type: Object, required: true }],
//   contact: { type: Object, required: true },
//   emergencyContact: Object,

//   price: {
//     base: { type: Number, required: true },
//     taxes: { type: Number, required: true },
//     extras: { type: Number, default: 0 },
//     total: { type: Number, required: true },
//     currency: { type: String, default: "USD" }
//   },

//   selectedSeats: { type: Schema.Types.Mixed },
//   paymentIntentId: String,

//   bookedAt: { type: Date, default: Date.now },
//   expiresAt: { type: Date, default: () => new Date(Date.now() + 30 * 60 * 1000) }
// });

// bookingSchema.pre("save", function (next) {
//   if (!this.bookingReference) {
//     this.bookingReference = "TPM" + Math.random().toString(36).substring(2, 8).toUpperCase();
//   }
//   next();
// });

// export const Booking = model<IBooking>("Booking", bookingSchema);
