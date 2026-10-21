import { useState } from "react";
import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { PriceRangeSlider } from "@/components/ui/PriceRangeSlider";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Showcase } from "./Showcase";

export function FormShowcase() {
  const [price, setPrice] = useState<[number, number]>([20_000_000, 90_000_000]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Showcase title="Inputs">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Full name" placeholder="Ayo Bello" />
          <Input label="Phone number" type="tel" placeholder="+234 801 234 5678" />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            defaultValue="ayo@"
            error="Enter a valid email address"
            containerClassName="sm:col-span-2"
          />
          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            labelAction={
              <Link to="/forgot-password" className="text-[13px] text-gold hover:text-gold-light">
                Forgot password?
              </Link>
            }
            containerClassName="sm:col-span-2"
          />
        </div>
      </Showcase>

      <Showcase title="Select, textarea, checkbox, price range">
        <div className="flex flex-col gap-4">
          <Select
            label="Sort by"
            defaultValue="newest"
            options={[
              { value: "newest", label: "Newest arrivals" },
              { value: "price_asc", label: "Price: low to high" },
              { value: "price_desc", label: "Price: high to low" },
            ]}
          />
          <Textarea label="Message" placeholder="Tell us what you're looking for" rows={3} hint="Optional" />
          <Checkbox label="Keep me signed in" />
          <PriceRangeSlider min={10_000_000} max={150_000_000} value={price} onChange={setPrice} />
        </div>
      </Showcase>
    </div>
  );
}
