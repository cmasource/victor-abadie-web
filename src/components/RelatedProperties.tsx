import type { Property } from "@/types/property";
import { PropertyGrid } from "./PropertyGrid";
import { SectionTitle } from "./SectionTitle";

type RelatedPropertiesProps = {
  properties: Property[];
};

export function RelatedProperties({ properties }: RelatedPropertiesProps) {
  if (properties.length === 0) {
    return null;
  }

  return (
    <section className="bg-surface">
      <div className="container-page py-14">
        <SectionTitle title="También puede interesarte" />
        <div className="mt-8">
          <PropertyGrid properties={properties} />
        </div>
      </div>
    </section>
  );
}
