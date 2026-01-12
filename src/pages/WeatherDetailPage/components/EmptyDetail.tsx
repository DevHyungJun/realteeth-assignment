import { useNavigate } from "react-router-dom";
import { Button } from "../../../shared/ui";

const EmptyDetail = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-[100dvh] bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600 mb-4">날씨 정보를 찾을 수 없습니다.</p>
        <Button onClick={() => navigate("/")}>홈으로 돌아가기</Button>
      </div>
    </div>
  );
};

export default EmptyDetail;
