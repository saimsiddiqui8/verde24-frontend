export default function DashboardSection({ children, title }: SectionProps) {
  return (
    <div className="py-6 pl-8 pr-4 border border-primary rounded-md mb-6 relative">
      <h2 className="text-primary text-2xl font-semibold">{title}</h2>
      <div className="my-4">{children}</div>
    </div>
  );
}

interface SectionProps {
  children: React.ReactNode;
  title?: string;
}
