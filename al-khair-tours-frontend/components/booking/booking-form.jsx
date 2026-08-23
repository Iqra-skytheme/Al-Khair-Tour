"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BRAND } from "@/lib/constants";
import { submitBooking } from "@/lib/actions";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  phone: z.string().trim().min(6, "Please enter a valid phone").max(30),
  pickup: z.string().trim().min(2, "Pickup is required").max(120),
  dropoff: z.string().trim().min(2, "Drop-off is required").max(120),
  date: z.string().min(1, "Pick a date"),
  time: z.string().min(1, "Pick a time"),
  passengers: z.coerce.number().min(1).max(50),
  vehicle: z.string().min(1, "Choose a vehicle"),
  notes: z.string().max(500).optional(),
});

export function BookingForm({ defaultVehicle, vehicles = [] }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      passengers: 2,
      vehicle: defaultVehicle ?? vehicles[0]?.id ?? "",
    },
  });

  const onSubmit = async (values) => {
    const vehicle = vehicles.find((v) => v.id === values.vehicle)?.name ?? values.vehicle;
    const scheduledAt = new Date(`${values.date}T${values.time}`);
    try {
      await submitBooking({
        customer_name: values.name,
        customer_phone: values.phone,
        service_type: "ride",
        vehicle_id: values.vehicle,
        pickup: values.pickup,
        dropoff: values.dropoff,
        scheduled_at: isNaN(scheduledAt.getTime()) ? null : scheduledAt.toISOString(),
        passengers: values.passengers,
        notes: values.notes || null,
        source: "website",
      });
    } catch (err) {
      console.error("Booking insert failed", err);
    }
    const msg = [
      `*New Booking Request — ${BRAND.name}*`,
      ``,
      `Name: ${values.name}`,
      `Phone: ${values.phone}`,
      `Pickup: ${values.pickup}`,
      `Drop-off: ${values.dropoff}`,
      `Date: ${values.date} ${values.time}`,
      `Passengers: ${values.passengers}`,
      `Vehicle: ${vehicle}`,
      values.notes ? `Notes: ${values.notes}` : ``,
    ].filter(Boolean).join("\n");
    const url = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    router.push("/booking/confirmation");
  };

  const vehicleValue = watch("vehicle");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
      <Field label="Full name" error={errors.name?.message}>
        <Input placeholder="Your name" {...register("name")} />
      </Field>
      <Field label="Phone / WhatsApp" error={errors.phone?.message}>
        <Input placeholder="+92 300 0000000" {...register("phone")} />
      </Field>
      <Field label="Pickup location" error={errors.pickup?.message}>
        <Input placeholder="e.g. Jeddah Airport T1" {...register("pickup")} />
      </Field>
      <Field label="Drop-off location" error={errors.dropoff?.message}>
        <Input placeholder="e.g. Makkah Hilton" {...register("dropoff")} />
      </Field>
      <Field label="Date" error={errors.date?.message}>
        <Input type="date" {...register("date")} />
      </Field>
      <Field label="Time" error={errors.time?.message}>
        <Input type="time" {...register("time")} />
      </Field>
      <Field label="Passengers" error={errors.passengers?.message}>
        <Input type="number" min={1} max={50} {...register("passengers")} />
      </Field>
      <Field label="Vehicle" error={errors.vehicle?.message}>
        <Select value={vehicleValue} onValueChange={(v) => setValue("vehicle", v, { shouldValidate: true })}>
          <SelectTrigger>
            <SelectValue placeholder="Choose vehicle" />
          </SelectTrigger>
          <SelectContent>
            {vehicles.map((v) => (
              <SelectItem key={v.id} value={v.id}>
                {v.category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <div className="sm:col-span-2">
        <Field label="Notes (optional)" error={errors.notes?.message}>
          <Textarea placeholder="Flight number, luggage, special requests…" rows={3} {...register("notes")} />
        </Field>
      </div>
      <div className="sm:col-span-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          Submitting opens WhatsApp with your details pre-filled. We reply within minutes.
        </p>
        <Button type="submit" size="lg" disabled={isSubmitting} className="gap-2">
          Send booking on WhatsApp
        </Button>
      </div>
    </form>
  );
}

function Field({ label, error, children }) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-sm">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}