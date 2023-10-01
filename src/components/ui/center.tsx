type CenterProps = {
  children: React.ReactNode;
};

export default function Center({ children }: CenterProps) {
  return (
    <div className="flex flex-1 items-center justify-center">{children}</div>
  );
}
