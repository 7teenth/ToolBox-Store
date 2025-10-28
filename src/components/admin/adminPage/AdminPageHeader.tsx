type Props = {
  title?: string,
  subtitle?: string
}

export const AdminPageHeader = ({ title = "Title", subtitle }: Props) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="text-muted-foreground mt-1">{subtitle}</p>
      </div>
    </div>
  );
};