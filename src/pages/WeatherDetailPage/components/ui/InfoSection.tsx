type InfoSectionProps = {
  title: string;
  children: React.ReactNode;
};

const InfoSection = ({ title, children }: InfoSectionProps) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">{title}</h2>
      {children}
    </div>
  );
};

export default InfoSection;

