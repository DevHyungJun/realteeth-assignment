import { useNavigate } from "react-router-dom";
import { Button } from "../../shared/ui";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-[100dvh] bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="text-center max-w-md w-full">
        <div className="mb-6">
          <h1 className="text-6xl sm:text-8xl font-bold text-gray-800 mb-2">
            404
          </h1>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">
            페이지를 찾을 수 없습니다
          </h2>
          <p className="text-sm sm:text-base text-gray-500">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          </p>
        </div>
        <Button onClick={() => navigate("/")} variant="primary">
          메인 페이지로 이동
        </Button>
      </div>
    </main>
  );
};

export default NotFoundPage;
