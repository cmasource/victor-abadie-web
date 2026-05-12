type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  headingLevel?: "h1" | "h2";
};

export function SectionTitle({
  eyebrow,
  title,
  description,
  align = "left",
  headingLevel = "h2",
}: SectionTitleProps) {
  const Heading = headingLevel;

  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow ? (
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-brand-dark">
          {eyebrow}
        </p>
      ) : null}
      <Heading className="text-3xl font-extrabold tracking-tight text-[#111111] md:text-4xl">
        {title}
      </Heading>
      {description ? (
        <p className="mt-4 text-base leading-7 text-muted md:text-lg">{description}</p>
      ) : null}
    </div>
  );
}
