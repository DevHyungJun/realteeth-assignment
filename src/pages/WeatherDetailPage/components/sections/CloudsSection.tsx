import { InfoSection } from "../ui";

type CloudsSectionProps = {
  cloudsPercentage: number;
};

const CloudsSection = ({ cloudsPercentage }: CloudsSectionProps) => {
  return (
    <InfoSection title="구름">
      <p className="text-lg font-semibold text-gray-800">{cloudsPercentage}%</p>
    </InfoSection>
  );
};

export default CloudsSection;
