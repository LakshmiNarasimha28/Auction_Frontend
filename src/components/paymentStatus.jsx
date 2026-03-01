const PaymentStatus = ({ payment, isSeller }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-50 border-green-200 text-green-700";
      case "pending":
        return "bg-yellow-50 border-yellow-200 text-yellow-700";
      case "failed":
        return "bg-red-50 border-red-200 text-red-700";
      default:
        return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return (
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "pending":
        return (
          <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "failed":
        return (
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Payment Completed";
      case "pending":
        return "Payment Pending";
      case "failed":
        return "Payment Failed";
      default:
        return "Unknown Status";
    }
  };

  const getMethodText = (method) => {
    switch (method) {
      case "online":
        return "Online Payment (Razorpay)";
      case "direct":
        return "Direct Payment";
      default:
        return "Unknown Method";
    }
  };

  return (
    <div className={`border rounded-lg p-6 ${getStatusColor(payment.status)}`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          {getStatusIcon(payment.status)}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold mb-2">{getStatusText(payment.status)}</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">Payment Method:</span>
              <span>{getMethodText(payment.method)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Amount:</span>
              <span className="font-bold">₹{payment.amount?.toLocaleString()}</span>
            </div>
            {payment.transactionId && (
              <div className="flex justify-between">
                <span className="font-medium">Transaction ID:</span>
                <span className="font-mono text-xs">{payment.transactionId}</span>
              </div>
            )}
            {payment.createdAt && (
              <div className="flex justify-between">
                <span className="font-medium">Created:</span>
                <span>{new Date(payment.createdAt).toLocaleString()}</span>
              </div>
            )}
            {payment.completedAt && (
              <div className="flex justify-between">
                <span className="font-medium">Completed:</span>
                <span>{new Date(payment.completedAt).toLocaleString()}</span>
              </div>
            )}
          </div>

          {payment.status === "pending" && payment.method === "direct" && (
            <div className="mt-4 p-3 bg-white bg-opacity-50 rounded border border-current">
              <p className="text-sm font-medium">
                {isSeller 
                  ? "Waiting for you to confirm payment receipt" 
                  : "Please complete the direct payment and wait for seller confirmation"}
              </p>
            </div>
          )}

          {payment.status === "completed" && (
            <div className="mt-4 flex items-center gap-2 text-sm font-semibold">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Transaction completed successfully!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentStatus;
