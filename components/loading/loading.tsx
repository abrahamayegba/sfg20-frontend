interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
}

export default function LoadingScreen({
  message = "Loading...",
  fullScreen = true,
}: LoadingScreenProps) {
  const containerClasses = fullScreen
    ? "fixed inset-0 bg-white z-50 flex items-center justify-center mt-[-50px]"
    : "flex items-center justify-center py-12";

  return (
    <div className={containerClasses}>
      <div className="text-center">
        <div className="mb-6">
          <img
            src="/ignite-logo.png"
            height={40}
            width={160}
            alt="Virtual Water Services"
            className="mx-auto mb-4"
          />
          <div className="flex items-center justify-center space-x-2">
            <span className="text-xl font-semibold text-gray-900">
              Ignite Consultancy Services
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-lg text-gray-600">{message}</p>
          <div className="flex justify-center">
            <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
