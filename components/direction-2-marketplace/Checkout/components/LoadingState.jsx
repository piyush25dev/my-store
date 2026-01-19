export default function LoadingState() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-lg font-medium">Loading your checkout...</p>
        <p className="text-sm text-gray-500">Preparing your order details</p>
      </div>
    </div>
  );
}