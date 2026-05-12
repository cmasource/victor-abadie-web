import { InstagramExternalWidget } from "@/components/InstagramExternalWidget";
import { InstagramShowcase } from "@/components/InstagramShowcase";
import { getPublishedProperties } from "@/lib/propertiesRepository";

type InstagramEmbedProps = {
  embedHtml?: string;
};

export async function InstagramEmbed({ embedHtml }: InstagramEmbedProps) {
  if (!embedHtml) {
    const properties = await getPublishedProperties();
    return <InstagramShowcase properties={properties} />;
  }

  return (
    <section className="bg-surface">
      <div className="container-page py-14">
        {/* Pegar aquí el código de Taggbox, Elfsight, Flockler u otro widget si se decide usar feed real. */}
        <InstagramExternalWidget provider="custom" rawEmbedHtml={embedHtml} />
      </div>
    </section>
  );
}
