"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { Plus, Trash2 } from "lucide-react";

export function VehicleForm({ vehicle, action, token }) {
  const [error, setError] = useState("");
  const [routes, setRoutes] = useState(
    vehicle?.routes?.length ? vehicle.routes : [{ label: "", priceSAR: "" }]
  );

  const onSubmit = async (formData) => {
    setError("");
    const cleanRoutes = routes
      .filter((r) => r.label.trim())
      .map((r) => ({ label: r.label.trim(), priceSAR: Number(r.priceSAR) || 0 }));
    formData.set("routes", JSON.stringify(cleanRoutes));

    const result = await action(formData);
    if (result?.error) setError(result.error);
  };

  function updateRoute(index, field, value) {
    setRoutes((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)));
  }

  function addRoute() {
    setRoutes((prev) => [...prev, { label: "", priceSAR: "" }]);
  }

  function removeRoute(index) {
    setRoutes((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <form action={onSubmit} className="grid max-w-2xl gap-4">
      {!vehicle && (
        <Field label="ID (unique, no spaces — leave blank to auto-generate from name)">
          <Input name="id" placeholder="e.g. economy-camry" />
        </Field>
      )}
      <Field label="Name">
        <Input name="name" required defaultValue={vehicle?.name} />
      </Field>
      <Field label="Category">
        <Input name="category" required placeholder="Economy / Family / VIP" defaultValue={vehicle?.category} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Seats">
          <Input type="number" name="seats" min={1} required defaultValue={vehicle?.seats ?? 4} />
        </Field>
        <Field label="Luggage capacity">
          <Input type="number" name="luggage" min={0} required defaultValue={vehicle?.luggage ?? 4} />
        </Field>
      </div>

      <ImageUploadField name="image" label="Vehicle image" token={token} defaultUrl={vehicle?.image ?? ""} />

      <div className="grid gap-2">
        <Label>Routes & prices</Label>
        <div className="grid gap-2">
          {routes.map((route, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                placeholder="e.g. Jeddah Airport → Makkah Hotel"
                value={route.label}
                onChange={(e) => updateRoute(i, "label", e.target.value)}
                className="flex-1"
              />
              <Input
                type="number"
                placeholder="Price (SAR)"
                value={route.priceSAR}
                onChange={(e) => updateRoute(i, "priceSAR", e.target.value)}
                className="w-32"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeRoute(i)}
                disabled={routes.length === 1}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
        <Button type="button" variant="outline" size="sm" className="w-fit gap-2" onClick={addRoute}>
          <Plus className="h-4 w-4" /> Add route
        </Button>
      </div>

      <Field label="Features (one per line)">
        <Textarea
          name="features"
          rows={4}
          defaultValue={vehicle?.features ? vehicle.features.join("\n") : ""}
        />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Sort order">
          <Input type="number" name="sort_order" defaultValue={vehicle?.sort_order ?? 0} />
        </Field>
        <label className="mt-6 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="available"
            defaultChecked={vehicle?.available ?? true}
            className="h-4 w-4"
          />
          Available (visible on website)
        </label>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="w-fit">
        {vehicle ? "Save changes" : "Create vehicle"}
      </Button>
    </form>
  );
}

function Field({ label, hint, children }) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}